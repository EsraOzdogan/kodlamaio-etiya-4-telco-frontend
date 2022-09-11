import { Component, OnInit } from '@angular/core';
import { Offer } from 'src/app/features/offers/models/offer';
import { OfferService } from 'src/app/features/offers/services/offer/offer.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
})
export class BasketComponent implements OnInit {
  basket: Offer[] = [];
  selectedCatalogOfferList!: Offer[];
  selectedCampaignOffersList!: Offer[];
  campaignOffersList!: Offer[];
  matchCampaignList: Offer[] = [];
  findMatch!: Offer;
  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.getBasket();
  }
  getBasket() {
    this.offerService.basket$.subscribe((data) => {
      //this.basket = data;
  
      this.selectedCatalogOfferList = data.filter((offer) => {
        return offer.type.typeName == 'catalog';
      });

      this.selectedCampaignOffersList = data.filter((offer) => {
        return offer.type.typeName == 'campaign';
      });

      this.offerService.getList().subscribe((data) => {
        this.campaignOffersList = data.filter(
          (offer) => offer.type.typeName === 'campaign'
        );

        this.campaignOffersList.forEach((campaign) => {
          this.selectedCampaignOffersList.forEach((selectedCampaign) => {
            if (campaign.type.id === selectedCampaign.type.id) {
             // this.matchCampaignList.push(campaign);
              this.basket.push(campaign)
            } else {
            }
          });
        });
        
      });

      // console.log('matchArray', this.matchCampaignList);
      // console.log('catalog', this.selectedCatalogOfferList);
      
      this.selectedCatalogOfferList.forEach((catalog) => {
        this.basket.push(catalog);
      });
      //console.log('basket', this.basket);
    });

  }

  get amount(): number {
    let sumAmount: number = 0;
    if (this.basket === undefined) return sumAmount;
    this.basket.forEach((offer) => {
      sumAmount += offer.products.reduce(
        (beforeAmount, product) => beforeAmount + product.amount,
        0
      );
    });
    return sumAmount;
  }
  clear() {
    this.basket = [];
    this.offerService.clearBasketInStore();
  }
}
