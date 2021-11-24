import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import ('./components/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'booking',
    loadChildren: () => import ('./components/booking/booking.module').then(m => m.BookingModule)
  },
  {
    path: 'seat',
    loadChildren: () => import ('./components/seat/seat.module').then(m => m.SeatModule)
  },
  {
    path: 'contact',
    loadChildren: () => import ('./components/contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('./pages/modal/modal.module').then( m => m.ModalPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
