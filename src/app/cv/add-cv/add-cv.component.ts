import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { CvService } from "../services/cv.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APP_ROUTES } from "src/config/routes.config";
import { Cv } from "../model/cv";
import { FormDataService } from "src/app/services/form-data/form-data.service";
import { FormData } from "src/app/services/form-data/form-data.model";
import { combineLatest, debounceTime, distinctUntilChanged, of, switchMap, tap } from "rxjs";

@Component({
  selector: "app-add-cv",
  templateUrl: "./add-cv.component.html",
  styleUrls: ["./add-cv.component.css"],
})
export class AddCvComponent implements OnInit {
  constructor(
    private cvService: CvService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private formDataService: FormDataService
  ) { }

  ngOnInit() {
    const formData = this.formDataService.getFormData();
    if (formData) {
      this.form.patchValue(formData);
    }

    this.form.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((data) => {
      this.formDataService.setFormData(data as FormData);
    });

    this.form.get('age')?.valueChanges.subscribe((age) => {
      if (age && age < 18) {
        this.form.get('path')?.disable();
      } else {
        this.form.get('path')?.enable();
      }
    });


    this.listenOnCinChanges();

    this.listenOnCinAgeChanges();


    // this.form.get('cin')?.valueChanges.pipe(
    //   debounceTime(500),
    //   distinctUntilChanged(),
    //   switchMap((cin: string | null) => {
    //     if (cin) {
    //       console.log('Searching for CV with cin:', cin);
    //       return this.cvService.getCvById(Number(cin)); 
    //     }
    //     return of([]);// this will block the flow in case of an error
    //   })
    // ).subscribe({
    //   next: (cv: any) => {
    //     if (cv) {
    //       this.form.get('cin')?.setErrors({ cinExist: true });
    //       console.log('CV found:', cv);
    //     } else {
    //       this.form.get('cin')?.setErrors(null);
    //       console.log('CV not found');
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Error while searching for CV:', err);
    //   }
    // });








  }


  form = this.formBuilder.group(
    {
      name: ["", Validators.required],
      firstname: ["", Validators.required],
      path: [""],
      job: ["", Validators.required],
      cin: [
        "",
        {
          validators: [Validators.required, Validators.pattern("[0-9]{8}")],
        },
      ],
      age: [
        0,
        {
          validators: [Validators.required],
        },
      ],
    },
  );
  
  listenOnCinAgeChanges() {
    combineLatest([
      this.form.get('cin')?.valueChanges.pipe(debounceTime(500))!,
      this.form.get('age')?.valueChanges.pipe(debounceTime(500))!,
    ]).subscribe(([cin, age]) => {
      const Cinnumber = Number(cin?.slice(0, 2));
      if (age && age >= 60) {
        if (Cinnumber >= 0 && Cinnumber < 20) {
          this.form.get('cin')?.setErrors(null);
        }
        else {
          this.form.get('cin')?.setErrors({ cinAge: true });
        }
      } else {
        if (Cinnumber >= 20) {
          this.form.get('cin')?.setErrors(null);
        }
        else {
          this.form.get('cin')?.setErrors({ cinAge: true });
        }
      }
    })
  }

  listenOnCinChanges() {
    this.form.get('cin')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((cin: string | null) => {
      console.log('CIN field changed to:', cin);
      this.cvService.getCvById(Number(cin)).subscribe({
        next: (cv: any) => {
          if (cv) {
            this.form.get('cin')?.setErrors({ cinExist: true });
            console.log('CV found:', cv);
          } else {
            this.form.get('cin')?.setErrors(null);
            console.log('CV not found');
          }
        },
        error: (err) => {
          console.error('Error while searching for CV:', err);
        }
      });
    });
  }




  addCv() {
    this.cvService.addCv(this.form.value as Cv).subscribe({
      next: (cv) => {
        this.router.navigate([APP_ROUTES.cv]);
        this.toastr.success(`Le cv ${cv.firstname} ${cv.name}`);
      },
      error: (err) => {
        this.toastr.error(
          `Une erreur s'est produite, Veuillez contacter l'admin`
        );
      },
    });
    this.formDataService.clearFormData();
  }

  get name(): AbstractControl {
    return this.form.get("name")!;
  }
  get firstname() {
    return this.form.get("firstname");
  }
  get age(): AbstractControl {
    return this.form.get("age")!;
  }
  get job() {
    return this.form.get("job");
  }
  get path() {
    return this.form.get("path");
  }
  get cin(): AbstractControl {
    return this.form.get("cin")!;
  }
}
