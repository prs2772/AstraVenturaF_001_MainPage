import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface QuickAccessCard {
    title: string;
    description: string;
    route: string;
    icon: string;
}

interface SummaryStat {
    label: string;
    value: string;
    icon: string;
}

@Component({
    standalone: true,
    selector: 'app-home',
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    stats: SummaryStat[] = [
        {
            label: 'Modules',
            value: '4',
            icon: 'M4 6h16M4 10h16M4 14h16M4 18h16'
        },
        {
            label: 'Status',
            value: 'Online',
            icon: 'M13 10V3L4 14h7v7l9-11h-7z'
        },
        {
            label: 'Uptime',
            value: '99.9%',
            icon: 'M22 12h-4l-3 9L9 3l-3 9H2'
        }
    ];

    cards: QuickAccessCard[] = [
        {
            title: 'Fleet Registry',
            description: 'Browse and manage all registered vehicles in the system',
            route: '/vehiculos',
            icon: 'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-4 12h8a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2z'
        },
        {
            title: 'Add Vehicle',
            description: 'Register a new vehicle unit into the fleet database',
            route: '/vehiculos/crear',
            icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        {
            title: 'Fleet Optimizer',
            description: 'Run optimization algorithms on the current fleet composition',
            route: '/vehiculos/flota',
            icon: 'M22 12h-4l-3 9L9 3l-3 9H2'
        },
        {
            title: 'External Models',
            description: 'Search and compare vehicle models from external data sources',
            route: '/vehiculos/modelos-externos',
            icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
        },
        {
            title: 'Notebook',
            description: 'Personal workspace for notes, logs and documentation',
            route: '/notebook',
            icon: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 014 17V4.5A2.5 2.5 0 016.5 2H20v20H6.5'
        }
    ];
}
