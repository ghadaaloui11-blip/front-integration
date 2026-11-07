import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampagneService, Campagne } from '../../../core/services/campagne.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-campaign',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-campaign.component.html',
  styleUrls: ['./edit-campaign.component.css']
})
export class EditCampaignComponent implements OnInit {
  campaignId!: number;
  campaign!: Campagne;
  editForm!: FormGroup;
  isLoading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campagneService: CampagneService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.campaignId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadCampaign();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      objectif_montant: ['', [Validators.required, Validators.min(1)]],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required]
    });
  }

  loadCampaign(): void {
    this.isLoading = true;
    this.campagneService.getOne(this.campaignId).subscribe({
      next: (campaign) => {
        this.campaign = campaign;
        this.editForm.patchValue({
          titre: campaign.titre,
          description: campaign.description,
          objectif_montant: campaign.objectif_montant,
          date_debut: campaign.date_debut,
          date_fin: campaign.date_fin
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de la campagne';
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
    
    const updateData = {
      titre: this.editForm.value.titre,
      description: this.editForm.value.description,
      objectif_montant: Number(this.editForm.value.objectif_montant),
      date_debut: this.editForm.value.date_debut,
      date_fin: this.editForm.value.date_fin
    };

    this.campagneService.update(this.campaignId, updateData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/mes-campagnes']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour de la campagne';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onDelete(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette campagne ? Cette action est irréversible.')) {
      this.isLoading = true;
      this.campagneService.delete(this.campaignId).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/mes-campagnes']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de la campagne';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/mes-campagnes']);
  }
}