import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            // {
            //     label: 'CUSTOMERS',
            //     items: [
            //         { label: 'CustomerList', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/cargointake'] },
            //         { label: 'Add Customer', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/shipmentlist'] },
            //     ]
            // },
            {
                label: 'SHIPMENTS',
                items: [
                    { label: 'Cargo Booking', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/input'] },
                    { label: 'Shipment List', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/list'] },
                    { label: 'Orphan Cargo', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
                ]
            },
            // {
            //     label: 'JOURNEYS',
            //     items: [
            //         { label: 'Active Voyages', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/cargointake'] },
            //         { label: 'Create Journey', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/shipmentlist'] },
            //         { label: 'Voyage History', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
            //     ]
            // },
            // {
            //     label: 'WAREHOUSE',
            //     items: [
            //         { label: 'Location Management', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/cargointake'] },
            //         { label: 'Daily Cargo List', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/shipmentlist'] },
            //         { label: 'Move Tickets', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
            //     ]
            // },
            // {
            //     label: 'BILLINGS',
            //     items: [
            //         { label: 'Invoices', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/cargointake'] },
            //         { label: 'Payments', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/shipmentlist'] },
            //         { label: 'Revenue Reports', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
            //     ]
            // },
            // {
            //     label: 'REPORTS',
            //     items: [
            //         { label: 'Cargo Summary', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/cargointake'] },
            //         { label: 'Revenue Analysis', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/shipmentlist'] },
            //         { label: 'Customer Reports', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
            //     ]
            // },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    }
                ]
            },
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 2.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    }
                ]
            },
            // {
            //     label: 'Get Started',
            //     items: [
            //         {
            //             label: 'Documentation',
            //             icon: 'pi pi-fw pi-book',
            //             routerLink: ['/documentation']
            //         },
            //         {
            //             label: 'View Source',
            //             icon: 'pi pi-fw pi-github',
            //             url: 'https://github.com/primefaces/sakai-ng',
            //             target: '_blank'
            //         }
            //     ]
            // }
        ];
    }
}
