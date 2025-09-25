export class InsightsPathRoutes {

    static readonly auth = 'auth';
    static readonly insights = 'insights';

    static readonly login = 'login';
    static readonly access = 'access';
    static readonly reset = 'reset';

    static readonly dashboard = 'dashboard';
    static readonly geographicData = 'geographic-data';
    static readonly newInspection = 'new-inspection';
    static readonly viewDetail = 'view-detail';
    static readonly allInspections = 'all-inspections';
    static readonly patients = 'patients';
    static readonly doctors = 'doctors';
    static readonly notfound = 'notfound';

    // Rutas de auth
    static readonly authLogin = `/${this.auth}/${this.login}`;
    static readonly authAccess = `/${this.auth}/${this.access}`;

    // Rutas de aplicación
    static readonly pathDashboard = `/${this.insights}/${this.dashboard}`;
    static readonly pathGeographicData = `/${this.insights}/${this.geographicData}`;
    static readonly pathNewInspection = `/${this.insights}/${this.newInspection}`;
    static readonly pathViewDetail = `/${this.insights}/${this.viewDetail}`;
    static readonly pathAllInspections = `/${this.insights}/${this.allInspections}`;
    static readonly pathPatients = `/${this.insights}/${this.patients}`;
    static readonly pathDoctors = `/${this.insights}/${this.doctors}`;

}
