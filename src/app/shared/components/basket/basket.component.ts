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
      //console.warn(this.basket);

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

        //console.log('bbbbbbb', this.campaignOffersList);
        //console.log('selected', this.selectedCampaignOffersList);

        this.campaignOffersList.forEach((campaign) => {
          this.selectedCampaignOffersList.forEach((selectedCampaign) => {
            if (campaign.type.id === selectedCampaign.type.id) {
              //console.warn('match', campaign);
              this.matchCampaignList.push(campaign);
            } else {
              //console.warn('notmatch', campaign);
            }
          });
          //console.warn('aaaaaaa', this.matchCampaignList);
        });
        //this.basket = this.selectedCatalogOfferList;

        //this.matchCampaignList.push(this.findMatch);
        //console.warn(this.matchCampaignList);

        // this.campaignOffersList = data.filter(
        //   (offer) => offer.type.typeName === 'campaign'
        // );
      });

      // this.matchCampaignList.forEach((campaign) => {
      //   console.log('aaaaassssssaaaa', campaign);
      //   //this.selectedCatalogOfferList.push(campaign);
      // });
      //console.log('basket', this.selectedCatalogOfferList);

      //console.log('catalog', this.selectedCatalogOfferList);
      console.log('matchArray', this.matchCampaignList);
      console.log('catalog', this.selectedCatalogOfferList);

      // this.matchCampaignList.forEach((campaign) => {
      //   this.basket.push(campaign);
      // });
      // this.selectedCatalogOfferList.forEach((catalog) => {
      //   this.basket.push(catalog);
      // });
      console.log('basket', this.basket);
    });
    //console.warn('matchArrayaaaaa', this.matchCampaignList);
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
    this.offerService.clearBasketInStore();
  }
}
