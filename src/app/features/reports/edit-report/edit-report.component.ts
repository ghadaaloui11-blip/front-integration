import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalementService, Signalement } from '../../../core/services/signalement.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-report.component.html',
  styleUrls: ['./edit-report.component.css']
})
export class EditReportComponent implements OnInit {
  reportId!: number;
  report!: Signalement;
  editForm!: FormGroup;
  isLoading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signalementService: SignalementService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.reportId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadReport();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(10)]],
      latitude: ['', [Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.min(-180), Validators.max(180)]],
      est_anonyme: [false]
    });
  }

  loadReport(): void {
    this.isLoading = true;
    this.signalementService.getSignalement(this.reportId).subscribe({
      next: (report) => {
        this.report = report;
        this.editForm.patchValue({
          description: report.description || '',
          latitude: report.latitude || '',
          longitude: report.longitude || '',
          est_anonyme: report.est_anonyme || false
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du signalement';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    const formData = new FormData();
    formData.append('description', this.editForm.value.description);
    formData.append('latitude', this.editForm.value.latitude?.toString() || '');
    formData.append('longitude', this.editForm.value.longitude?.toString() || '');
    formData.append('est_anonyme', this.editForm.value.est_anonyme.toString());

    this.signalementService.updateSignalement(this.reportId, formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/mes-signalements']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour du signalement';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/mes-signalements']);
  }
}