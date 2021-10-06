import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlaceOrderComponent} from "./components/place-order/place-order.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

const routes: Routes = [
  {path: 'place-order', component: PlaceOrderComponent},
  {path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
