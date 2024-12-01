import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-getstarted',
  templateUrl: './getstarted.page.html',
  styleUrls: ['./getstarted.page.scss'],
})
export class GetstartedPage implements OnInit {
  
  constructor() {}

  ngOnInit() {}
}
