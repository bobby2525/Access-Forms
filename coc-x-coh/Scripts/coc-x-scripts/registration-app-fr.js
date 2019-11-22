/**
 * Canada Olympic House Registration
 * Canadian Olympic Committee
 * Jivan Maharaj
 * jmaharaj@olympic.ca
 **/
var app = angular.module('registration-app', ['$strap.directives','flashr']);
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);
app.value('$strapConfig', {
    datepicker: {
        language: 'fr'
    }
});

app.controller('registration-form', function ($scope, $http,flashr) {
    var template = {
        application: {
            affiliation:{type:'',firstName:'',lastName:'',relationship:{type:'',value:''},area:{type:'',value:''}},
            dob: '',
            arrival: '',
            arrivalTime: '',
            arrivalFlight: '',
            departure: '',
            departureTime: '',
            sochiAddress: '',
            sochiStreetAddress: '',
            sochiProvince: '',
            sochiCity: '',
            sochiPostal:'',
            phones: [{primary: true, value:''}],
            emails: [{ primary: true, value: '' }],
            travelReminder: false,
            access: { coh: true, opening: false, closing: false, digital: true },
            complete: false,
            post: false,
            visa: false,
            visa_number:''
        }
    };
    $scope.errMsg = false;
    $scope.networError = false;
    $scope.loader = false;
    $scope.step = 0;
    $scope.steps = [
        { step: 'Personal Information', complete: false },
        { step: 'Affiliation', complete: false },
        { step: 'Travel Information', complete: false },
        { step: 'Access', complete: false }
    ];
    $scope.next = function () {
        $scope.steps[$scope.step].complete = true;
    }
    $scope.addEmail = function () {
        $scope.form.application.emails.push({ primary: false, value: '' });
    }
    $scope.addPhone = function ()
    {
        $scope.form.application.phones.push({ primary: false, value: '' });
    }
    $scope.removeEmail = function (index) {
        $scope.form.application.emails.splice(index, 1);
    }
    $scope.removePhone = function (index) {
        $scope.form.application.phones.splice(index, 1);
    };
    $scope.save = function (stage) {
        switch (stage) {
            case 0:
                if ($scope.alpha.$valid && $scope.steps[0].complete) {
                    if ($scope.step < $scope.steps.length - 1) {
                        $scope.step++
                    }
                }
                else {
                    var errors = $scope.alpha.$error;
                }
                break;
            case 1:
                if ($scope.beta.$valid && $scope.steps[1].complete) {

                    if ($scope.step < $scope.steps.length - 1) {
                        $scope.step++
                    }
                }
                else {
                    var errors = $scope.beta.$error;
                }
                break;
            case 2:
                if ($scope.gamma.$valid && $scope.steps[2].complete) {
                    if ($scope.step < $scope.steps.length - 1) {
                        $scope.step++
                    }
                }
                else {
                    var errors = $scope.gamma.$error;
                }
                break;
            case 3:
                if ($scope.delta.$valid && $scope.steps[3].complete) {
                    $scope.form.application.complete = true;
                    $scope.loader = true;
                    if ($scope.form.application.language == "French") {
                        sendData($scope.form.application, '/fr/register/complete');
                    }
                    else {
                        sendData($scope.form.application, "/en/register/complete");
                    }
                }
                else {
                    $scope.form.application.complete = false;
                }
                break;
            default:
                break;
        }
    };
    $scope.reset = function () {

        $scope.steps[$scope.step].complete = false;

        //$scope.form = angular.copy(template);

    }
    $scope.back = function () {
        $scope.steps[$scope.step - 1].complete = false;
        $scope.steps[$scope.step].complete = false;
        $scope.step--;
    };
    $scope.cancel = function () {
        $scope.form = angular.copy(template);
    };
    function sendData(data, target) {
			if(!jQuery.support.cors){
				 var xdr = new XDomainRequest();
				        xdr.open("GET", "http://sochi-x-data.olympic.ca/api/registerie?" + JSON.stringify(data));
				        xdr.send(JSON.stringify(data));
				        xdr.onload = function ()
				        {
				            var x = xdr.responseText;
				            if (x != "null" && x != null)
				            {
				                var r = JSON.parse(x);
				                if (r.saved == true)
				                {
				                    window.location = target;
				                }
				                else
				                {
				                    $scope.errMsg = true;
				                    for (var i = 0; i < $scope.steps.length; i++)
				                    {
				                        $scope.steps[i].complete = false;
				                    }
				                    $scope.step = 0;
				                    $scope.loader = false;
				                }
				            }
	        }

				}
	        else
	        {
				$http.defaults.useXDomain = true;
				        $http.post('http://sochi-x-data.olympic.ca/api/register', data)
				                    .success(function (data) {
				                        $scope.loader = false;
				                        console.log(data);
				                        if (data.saved == true) {
				                            window.location = target;
				                        }
				                        else {
				                            $scope.errMsg = true;
				                            for (var i = 0; i < $scope.steps.length; i++) {
				                                $scope.steps[i].complete = false;
				                            }
				                            $scope.step = 0;
				                            $scope.loader = false;
				                            $scope.form = angular.copy(template);
				                        }
				                    })
				                    .error(function (data) {
				                        $scope.networError = true;
				                        for (var i = 0; i < $scope.steps.length; i++) {
				                            $scope.steps[i].complete = false;
				                        }
				                        console.log(data);
				                        $scope.step = 0;
				                        $scope.loader = false;
	                    });
				}
    };
    $scope.cancel();
    //
    $scope.affiliations = [
        { type: 'Famille ou ami d\'un athlète de l\'équipe olympique des Jeux de Sotchi 2014', value: 'athlete', note: 'Un maximum de 6 invités membres de la famille et des amis peuvent être inscrits à la MOC. Ils recevront tous un laissez-passer donnant droit à un accès complet. Les autres invités auront droit à un des laissez-passer journaliers accordés par les agents responsables de la famille et des amis à leur discrétion. Tous les détenteurs de laissez-passer journalier doivent être accompagnés par un détenteur de laissez-passer à accès complet.', active: true, template: 'athlete.html' },
        { type: 'Famille ou ami d\'un entraîneur de l\'équipe olympique des Jeux de Sotchi 2014', value: 'coach', note: 'Un maximum de 2 invités membres de la famille et des amis peuvent être inscrits à la MOC. Ils recevront tous les deux un laissez-passer donnant droit à un accès complet.', active: true, template:'coach.html'},
        { type: 'Olympien ne participant pas aux compétitions', value: 'non-competing', note: 'Au plus 1 invité recevra un laissez-passer à accès complet; les autres recevront des laissez-passer journaliers au besoin et devront toujours être accompagnés d\'un détenteur de laissez-passer à accès complet.', active: true, template: 'noncompetingolympian.html' },
        { type: 'Invité d\'un olympien ne participant pas aux compétitions', value: 'olympian', note: 'Un maximum de deux (2) invités membres de la famille et des amis par jour recevra un laissez-passer journalier. Tous les détenteurs de laissez-passer journalier doivent être accompagnés par un détenteur de laissez-passer à accès complet.', active: true, template: 'olympian.html' },
        { type: 'Invité d\'un membre de l\'équipe de mission', value: 'mission', note: 'Au plus 1 invité recevra un laissez-passer à accès complet; les autres recevront des laissez-passer journaliers au besoin et devront toujours être accompagnés d\'un détenteur de laissez-passer à accès complet.', active: true, template: 'mission.html' },
        { type: 'Invité d\'un membre du personnel des FNS accrédité (Ao ou P) dans l\'équipe olympique de Sotchi 2014', value: 'nsf', note: 'Au plus 1 invité recevra un laissez-passer à accès complet; les autres recevront des laissez-passer journaliers au besoin et devront toujours être accompagnés d\'un détenteur de laissez-passer à accès complet.', active: true, template: 'nsf.html' },
        { type: 'Invité d\'un officiel canadien de compétition', value: 'official', note: 'Un invité avec un laissez-passer journalier. Tous les détenteurs de laissez-passer journalier doivent être accompagné par un détenteur de laissez-passer à accès complet.', active: true, template: 'official.html' },
        { type: 'Fédération nationale de sport - membres de la direction et de l\'équipe de soutien technique (non accrédités)', value: 'nsf_exec', note: 'Un maximum de quatre (4) laissez-passer seront remis aux membres de l\'équipe de direction des FNS. Tous les laissez-passer donneront droit à un accès complet. Un maximum de quatre (4) laissez-passer donnant droit à un accès complet sera accordé aux membres de l\'équipe de soutien technique en fonction de la taille de l\'équipe. Les invités supplémentaires doivent préalablement s\'inscrire pour obtenir une chance de recevoir un laissez-passer journalier si la capacité de la MOC le permet et à la discrétion des responsables de la gestion de la MOC sur les lieux. Tous les détenteurs de laissez-passer journalier doivent être accompagnés par un détenteur de laissez-passer à accès complet.', active: true, template: 'nsf_exec.html' },
        { type: 'Membre de la direction du COC/de la Fondation ou membre du Conseil d\'administration', value: 'exec', note: null, active: true, template:'exec.html'},
        { type: 'Invité d\'un membre de la direction du COC/de la Fondation ou d\'un membre du Conseil d\'administration', value: 'coc_guest', note: 'Un maximum de quatre (4) invités par personne ou groupe peuvent être inscrits à la MOC. Ils recevront tous un laissez-passer donnant droit à un accès complet. Les invités supplémentaires doivent préalablement s\'inscrire pour obtenir une chance de recevoir un laissez-passer journalier si la capacité de la MOC le permet et à la discrétion des responsables de la gestion de la MOC sur les lieux. Tous les détenteurs de laissez-passer journalier doivent être accompagnés par un détenteur de laissez-passer à accès complet.', active: true, template:'coc_guest.html'},
        { type: 'Membre d\'un comité national olympique ou du Comité International Olympique', value: 'oc', note: 'Un maximum de quatre (4) invités par personne ou groupe peuvent être inscrits à la MOC. Ils recevront tous un laissez-passer donnant droit à un accès complet.', active: true, template:'oc.html'},
        { type: 'Commanditaires de la famille olympique', value: 'sponsor', note: null, active: true, template:'sponsor.html'},
        { type: 'Partenaires gouvernementaux', value: 'government', note: null, active: true, template:'government.html'},
        { type: 'Partenaires sportifs', value: 'partner', note: 'Un maximum de quatre (4) invités par personne ou groupe peuvent être inscrits à la MOC. Ils recevront tous un laissez-passer donnant droit à un accès complet.', active: true, template:'partner.html'},
        { type: 'Représentant d\'athlète', value: 'rep', note: 'Un maximum d\'un (1) représentant de l\'athlète peut être inscrit à la MOC. Il recevra un laissez-passer donnant droit à un accès complet. ', active: true, template:'rep.html'},
        { type: 'Membre du personnel des FNS accrédité (Ao ou P) dans l\'équipe olympique de Sotchi 2014', value: null, note: null, active: false, template:'blank.html'},
        { type: 'Athlète de l\'équipe olympique de Sotchi 2014', value: null, note: null, active: false, template:'blank.html'},
        { type: 'Entraîneur de l\'équipe olympique de Sotchi 2014', value: null, note: null, active: false, template:'blank.html'},
        { type: 'Officiel canadien de compétition des Jeux de Sotchi 2014', value: null, note: null, active: false, template:'blank.html'},
        { type: 'Membre de l\'équipe de mission de Sotchi 2014', value: null, note: null, active: false, template:'blank.html'},
        { type: 'Médias (accrédités/non accrédités, ENS)', value: 'media', note: 'MÉDIAS (ACCRÉDITÉ/NON ACCRÉDITÉ). POUR VOUS INSCRIRE EN VUE D\'OBTENIR L\'ACCÈS À L\'AIRE DES MÉDIAS À LA MAISON OLYMPIQUE DU CANADA, VEUILLEZ COMMUNIQUER AVEC JANE ALMEIDA À <a href="mailto:JALMEIDA@OLYMPIC.CA">JALMEIDA@OLYMPIC.CA</a>.', active: false, template: 'blank.html' },
        { type: 'Autre', note: 'Si aucune des catégories de la liste déroulante ne correspond à votre affiliation, veuillez décrire votre relation avec l\'Équipe olympique canadienne en donnant le plus de détails possible. Le Comité olympique canadien étudiera les candidatures, mais ne peut garantir l\'accès à la Maison olympique du Canada. ', active: true, template:'blank.html'}
    ];
    $scope.sports = [
        { type: 'Ski Alpin', value: 'Alpine Skiing' },
        { type: 'Tir à l\'arc', value: 'Archery' },
        { type: 'Athlétisme', value: 'Athletics' },
        { type: 'Badminton', value: 'Badminton' },
        { type: 'Baseball', value: 'Baseball' },
        { type: 'Basketball', value: 'Basketball' },
        { type: 'Biathlon', value: 'Biathlon' },
        { type: 'Bobsleigh', value: 'Bobsleigh' },
        { type: 'Boxe', value: 'Boxing' },
        { type: 'Canoë-kayak', value: 'Canoe-Kayak' },
        { type: 'Ski de fond', value: 'Cross Country Skiing' },
        { type: 'Curling', value: 'Curling' },
        { type: 'Cyclisme', value: 'Cycling' },
        { type: 'Plongeon', value: 'Diving' },
        { type: 'Sports équestre', value: 'Equestrian' },
        { type: 'Escrime', value: 'Fencing' },
        { type: 'Hockey sur gazon', value: 'Field Hockey' },
        { type: 'Patinage artistique', value: 'Figure Skating' },
        { type: 'Football', value: 'Football' },
        { type: 'Ski acrobatique', value: 'Freestyle Skiing' },
        { type: 'Gymnastique', value: 'Gymnastics' },
        { type: 'Handball', value: 'Handball' },
        { type: 'Hockey sur glace', value: 'Ice Hockey' },
        { type: 'Judo', value: 'Judo' },
        { type: 'Patinage de vitesse de longue piste', value: 'Long Track Speed Skating' },
        { type: 'Luge', value: 'Luge' },
        { type: 'Pentathlon moderne', value: 'Modern Pentathlon' },
        { type: 'Combiné nordique', value: 'Nordic Combined' },
        { type: 'Aviron', value: 'Rowing' },
        { type: 'Rugby', value: 'Rugby' },
        { type: 'Voile', value: 'Sailing' },
        { type: 'Tir', value: 'Shooting' },
        { type: 'Patinage de vitesse de courte piste', value: 'Short Track Speed Skating' },
        { type: 'Skeleton', value: 'Skeleton' },
        { type: 'Ski Cross', value: 'Ski Cross' },
        { type: 'Saut à ski', value: 'Ski Jumping' },
        { type: 'Surf des neiges', value: 'Snowboard' },
        { type: 'Natation', value: 'Swimming' },
        { type: 'Nage synchronisée', value: 'Synchronised Swimming' },
        { type: 'Tennis de table', value: 'Table Tennis' },
        { type: 'Taekwondo', value: 'Taekwondo' },
        { type: 'Tennis', value: 'Tennis' },
        { type: 'Triathlon', value: 'Triathlon' },
        { type: 'Volleyball', value: 'Volleyball' },
        { type: 'Water-polo', value: 'Water Polo' },
        { type: 'Haltérophilie', value: 'Weightlifting' },
        { type: 'Lutte', value: 'Wrestling' }
    ];
    $scope.winterSports = [
        { type: 'Ski Alpin', value: 'Alpine Skiing' },
        { type: 'Biathlon', value: 'Biathlon' },
        { type: 'Bobsleigh', value: 'Bobsleigh' },
        { type: 'Ski de fond', value: 'Cross Country Skiing' },
        { type: 'Curling', value: 'Curling' },
        { type: 'Patinage artistique', value: 'Figure Skating' },
        { type: 'Ski acrobatique', value: 'Freestyle Skiing' },
        { type: 'Hockey sur glace', value: 'Ice Hockey' },
        { type: 'Patinage de vitesse de longue piste', value: 'Long Track Speed Skating' },
        { type: 'Luge', value: 'Luge' },
        { type: 'Combiné nordique', value: 'Nordic Combined' },
        { type: 'Patinage de vitesse de courte piste', value: 'Short Track Speed Skating' },
        { type: 'Skeleton', value: 'Skeleton' },
        { type: 'Ski Cross', value: 'Ski Cross' },
        { type: 'Saut à ski', value: 'Ski Jumping' },
        { type: 'Surf des neiges', value: 'Snowboard' },
    ];
    $scope.nsfRelationships = [
        { type: 'Président de la FNS ', value: 'President' },
        { type: 'Chef de la direction ou directeur exécutif de la FNS', value: 'CEO or Executive Director' },
        { type: 'Membre du conseil de la FNS', value: 'Board Member' },
        { type: 'Membre de l\'équipe de soutien technique de la FNS ', value: 'Technical Support Team' },
        { type: 'Athlètes substituts / Partenaires d\'entraînement ', value: 'Athlete Alternate / Training Partner' },
        { type: 'Autre' }
    ];
    //
    $scope.nsfs = [
        { type: 'Canada alpin', value: 'Alpine Canada' },
        { type: 'Athlétisme Canada', value: 'Athletics Canada' },
        { type: 'Badminton Canada', value: 'Badminton Canada' },
        { type: 'Baseball Canada', value: 'Baseball Canada' },
        { type: 'Biathlon Canada', value: 'Biathlon Canada' },
        { type: 'Bobsleigh Canada Skeleton', value: 'Bobsleigh Canada Skeleton' },
        { type: 'Canada Basketball ', value: 'Canada Basketball' },
        { type: 'Canada Snowboard', value: 'Canada Snowboard' },
        { type: 'Association canadienne de boxe amateur ', value: 'Canadian Amateur Boxing Association' },
        { type: 'Association canadienne de lutte amateur', value: 'Canadian Amateur Wrestling Association' },
        { type: 'Association canadienne de canotage', value: 'Canadian Canoe Association' },
        { type: 'Association canadienne de curling ', value: 'Canadian Curling Association' },
        { type: 'Fédération canadienne d\'escrime', value: 'Canadian Fencing Federation' },
        { type: 'Association canadienne de ski acrobatique', value: 'Canadian Freestyle Ski Association' },
        { type: 'Association canadienne de luge', value: 'Canadian Luge Association' },
        { type: 'Association canadienne de pentathlon moderne', value: 'Canadian Modern Pentathlon Association' },
        { type: 'Association canadienne de soccer', value: 'Canadian Soccer Association' },
        { type: 'Association canadienne de tennis de table', value: 'Canadian Table Tennis Association' },
        { type: 'Fédération canadienne de handball olympique', value: 'Canadian Team Handball Federation' },
        { type: 'Fédération canadienne des dix-quilles ', value: 'Canadian Tenpin Federation' },
        { type: 'Association canadienne de water polo', value: 'Canadian Water Polo Association' },
        { type: 'Fédération haltérophile canadienne ', value: 'Canadian Weightlifting Federation' },
        { type: 'Ski de fond Canada', value: 'Cross Country Canada' },
        { type: 'Cycling Canada Cyclisme', value: 'Cycling Canada Cyclisme' },
        { type: 'Diving Plongeon Canada ', value: 'Diving Plongeon Canada' },
        { type: 'Canada Hippique', value: 'Equine Canada' },
        { type: 'Fédération canadienne des archers', value: 'Federation of Canadian Archers' },
        { type: 'Hockey sur gazon Canada', value: 'Field Hockey Canada' },
        { type: 'Golf Canada', value: 'Golf Canada' },
        { type: 'Gymnastique Canada', value: 'Gymnastics Canada' },
        { type: 'Hockey Canada', value: 'Hockey Canada' },
        { type: 'Judo Canada', value: 'Judo Canada' },
        { type: 'Association nationale de karaté du Canada ', value: 'Karate Canada' },
        { type: 'Ski combiné nordique Canada', value: 'Nordic Combined Ski Canada' },
        { type: 'Racquetball Canada ', value: 'Racquetball Canada' },
        { type: 'Sports à roulettes Canada ', value: 'Roller Sports Canada' },
        { type: 'Rowing Canada Aviron', value: 'Rowing Canada Aviron' },
        { type: 'Rugby Canada', value: 'Rugby Canada' },
        { type: 'Voile Canada', value: 'Sail Canada' },
        { type: 'Fédération de tir du Canada', value: 'Shooting Federation of Canada' },
        { type: 'Patinage Canada ', value: 'Skate Canada' },
        { type: 'Saut à ski Canada', value: 'Ski Jumping Canada' },
        { type: 'Softball Canada', value: 'Softball Canada' },
        { type: 'Patinage de vitesse Canada', value: 'Speed Skating Canada' },
        { type: 'Squash Canada ', value: 'Squash Canada' },
        { type: 'Natation Canada ', value: 'Swimming Canada' },
        { type: 'Synchro Canada ', value: 'Synchro Canada' },
        { type: 'Tennis Canada ', value: 'Tennis Canada' },
        { type: 'Triathlon Canada ', value: 'Triathlon Canada' },
        { type: 'Volleyball Canada', value: 'Volleyball Canada' },
        { type: 'Ski nautique et planche Canada ', value: 'Water Ski and Wakeboard Canada' },
        { type: 'Association canadienne de taekwondo', value: 'WTF Taekwondo Association of Canada' }
    ];
    $scope.winterNsfs = [];
    //
    $scope.fx = [
        { type: 'Équipe générale', value: 'Overall' },
        { type: 'Maison olympique du Canada', value: 'Canada Olympic House' },
        { type: 'Communications', value: 'Communications' },
        { type: 'Personnel à contrat', value: 'Contracted Personnel' },
        { type: 'Santé et science', value: 'Health and Science ' },
        { type: 'Habillement', value: 'Outfitting Operations' },
        { type: 'Centre de performance', value: 'Performane Centre' },
        { type: 'Services de sport', value: 'Sport Services' },
        { type: 'Opérations du Village/Services aux équipes', value: 'Village Operations | Team Services' }
    ];
   //
    $scope.cocRelationships = [
        { type: 'Bureau administratif du Comité olympique canadien', value: 'Corporate Operations' },
        { type: 'Membre du Conseil d\'administration du Comité olympique canadien', value: 'Canadian Olympic Committee Board Member' },
        { type: 'Membre du Conseil d\'administration de la Fondation olympique canadienne ', value: 'Canadian Olympic Committee Foundation Board Member' },
//        { type: 'Contacted Personnel', value: 'Contacted Personnel' },
        { type: 'Autre' }
    ];

    $scope.execRelationships = [
        { type: 'Bureau administratif du Comité olympique canadien', value: 'Canadian Olympic Committee Executive Staff' },
        { type: 'Membre du Conseil d\'administration du Comité olympique canadien', value: 'Canadian Olympic Committee Board Member' },
        { type: 'Membre du Conseil d\'administration de la Fondation olympique canadienne ', value: 'Canadian Olympic Foundation Board Member' }

    ];
    //
    $scope.vips = [
        { type: 'Comité international olympique', value: 'International Olympic Committee Member' },
        { type: 'Comités national olympiques (autre que le Canada)' },
        //{ type: 'VIP', value: 'VIP' },
        //{ type: 'Autre'}
    ];
    $scope.relationships = [
        { type: 'Oncle/tante', value: 'Oncle/tante' },
        { type: 'Cousin/Cousine', value: 'Cousin/Cousine' },
        { type: 'Ami(e)', value: 'Ami(e)' },
        { type: 'Grand-parent', value: 'grand-parent' },
        { type: 'Parent', value: 'parent' },
        { type: 'Frère/sœur ', value: 'sibling' },
        { type: 'Conjoint(e)/Partenaire', value: 'Conjoint(e)/Partenaire' },
        { type: 'Autre' }
    ];
    //
    $scope.sponsors = [
        { type: 'ADIDAS', value: 'ADIDAS' },
        { type: 'AIR CANADA', value: 'AIR CANADA' },
        { type: 'AMJ CAMPBELL INC.', value: 'AMJ CAMPBELL INC.' },
        { type: 'ATOS ORIGIN', value: 'ATOS ORIGIN' },
        { type: 'BELL', value: 'BELL' },
        { type: 'BMW GROUP CANADA', value: 'BMW GROUP CANADA' },
        { type: 'CGC', value: 'CGC' },
        { type: 'CBC/RADIO-CANADA', value: 'CBC/RADIO-CANADA' },
        { type: 'CANADIAN TIRE CORPORATION', value: 'CANADIAN TIRE CORPORATION' },
        { type: 'COCA-COLA', value: 'COCA-COLA' },
        { type: 'DELOITTE', value: 'DELOITTE' },
        { type: 'DOW CHEMICAL', value: 'DOW CHEMICAL' },
        { type: 'GENERAL ELECTRIC', value: 'GENERAL ELECTRIC' },
        { type: 'GENERAL MILLS', value: 'GENERAL MILLS' },
        { type: 'HAWORTH', value: 'HAWORTH' },
        { type: 'HILTON HHONORS', value: 'HILTON HHONORS' },
        { type: 'HUDSON\'S BAY', value: 'HUDSON\'S BAY' },
        { type: 'JET SET SPORTS', value: 'JET SET SPORTS' },
        { type: 'MCDONALD\'S CANADA', value: 'MCDONALD\'S CANADA' },
        { type: 'MOLSON COORS', value: 'MOLSON COORS' },
        { type: 'MONDELEZ INC.', value: 'MONDELEZ INC.' },
        { type: 'OAKLEY', value: 'OAKLEY' },
        { type: 'OMEGA', value: 'OMEGA' },
        { type: 'P&G', value: 'P&G' },
        { type: 'PANASONIC', value: 'PANASONIC' },
        { type: 'QUEBECOR', value: 'QUEBECOR' },
        { type: 'SUNCOR ENERGY', value: 'SUNCOR ENERGY' },
        { type: 'RBC', value: 'RBC' },
        { type: 'ROYAL CANADIAN MINT', value: 'ROYAL CANADIAN MINT' },
        { type: 'SAMSUNG', value: 'SAMSUNG' },
        { type: 'STAGE AND SCREEN', value: 'STAGE AND SCREEN' },
        { type: 'TECK', value: 'TECK' },
        { type: 'THE GLOBE AND MAIL', value: 'THE GLOBE AND MAIL' },
        { type: 'VISA', value: 'VISA' }
    ];
    $scope.provinces = [
        { type: 'Alberta', value: 'Alberta' },
        { type: 'Colombie-Britannique', value: 'British Columbia' },
        { type: 'Manitoba', value: 'Manitoba' },
        { type: 'Nouveau-Brunswick', value: 'New Brunswick' },
        { type: 'Terre-Neuve-et-Labrador', value: 'Newfoundland & Labrador' },
        { type: 'Nouvelle-Écosse ', value: 'Nova Scotia' },
        { type: '(territoires du) Nord-Ouest', value: 'Northwest Territories' },
        { type: 'Nunavut', value: 'Nunavut' },
        { type: 'I\'île du Prince-Édouard', value: 'Prince Edward Island' },
        { type: 'Ontario', value: 'Ontario' },
        { type: 'Québec', value: 'Quebec' },
        { type: 'Saskatchewan', value: 'Saskatchewan' },
        { type: 'Yukon', value: 'Yukon' }
    ];
    //
    $scope.governmentAgencies = [
        { type: 'Ambassade canadienne', value: 'Canadian Embassy' },
        { type: 'Fédéral', value: 'Federal' },
        { type: 'Provincial', value: 'Provincial' },
        { type: 'Municipal', value: 'Municipal' },
        { type: 'Autre' }
    ];
    $scope.sponsorRelationships = [
        { type: 'Employé', value: 'Employee' },
        { type: 'Invité d\'un employée', value: 'Employee Guest' },
        { type: 'Fournisseur de service/personnel de soutien ', value: 'Service Provider / Support Staff' },
        { type: 'Autre' },
    ];
    $scope.sportPartners = [
        { type: 'Entraîneurs du Canada ', value: 'Coaches of Canada' },
        { type: 'À nous le podium ', value: 'Own the Podium' },
        { type: 'Institut Canadien du sport', value: 'Canadian Sport Institute' },
        { type: 'Autre' }
    ];


});