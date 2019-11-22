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
                if ($scope.form.application.type == 'non-competing')
                {
                    console.log($scope.form);
                }
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
    $scope.affiliations = [
        { type: 'Family or Friend of Sochi 2014 Olympic Team Athlete', value: 'athlete', note: 'A maximum of six (6) Family & Friend guests can be registered for COH.  All will receive full access passes. Additional guests will be admitted on a daily access pass basis at the discretion of the Family & Friends officer onsite. Daily access pass guests must be accompanied by a full access pass holder.', active: true, template: 'athlete.html' },
        { type: 'Family or Friend of Sochi 2014 Olympic Team Coach', value: 'coach', note: 'A maximum of two (2) Family and Friend guests can be registered for COH.  All will receive full access passes.', active: true, template: 'coach.html' },
        { type: 'Non-Competing Olympian', value: 'non-competing', note: 'A maximum of one (1) guest can be registered for COH on a full access pass. Additional guests must pre-register and may be admitted on a daily access pass basis depending on COH capacity and at the discretion of COH management onsite. Daily access pass guests must be accompanied by a full access pass holder.', active: true, template: 'noncompetingolympian.html' },
        { type: 'Guest of Non-competing Olympian', value: 'olympian', note: 'A maximum of two (2) Family and Friend guests per day will receive daily access passes. All daily access guests need to be accompanied by the full access pass holder.', active: true, template: 'olympian.html' },        
        { type: 'Guest of Mission Team Member', value: 'mission', note: 'A maximum of one (1) guest can be registered for COH on a full access pass. Additional guests must pre-register and may be admitted on a daily access pass basis depending on COH capacity and at the discretion of COH management onsite. Daily access pass guests must be accompanied by a full access pass holder.', active: true, template: 'mission.html' },
        { type: 'Guest of NSF Accredited (Ao or P) Olympic Team Member', value: 'nsf', note: 'A maximum of one (1) guest can be registered for COH on a full access pass. Additional guests must pre-register and may be admitted on a daily access pass basis depending on COH capacity and at the discretion of COH management onsite. Daily access pass guests must be accompanied by a full access pass holder.', active: true, template: 'nsf.html' },
        { type: 'Guest of Canadian Competition Official', value: 'official', note: 'A maximum of one (1) Family & Friend guests per day will receive daily access passes. All daily access guests need to be accompanied by a full access pass holder.', active: true, template: 'official.html' },
        { type: 'National Sport Federations - Executive and Technical Support Team (non-accredited)', value: 'nsf_exec', note: 'A maximum of four (4) passes are available for NSF Executive team. All will receive full access passes. Up to an additional four (4) full access passes will be allotted for technical support teams, determined by total team size. Additional guests must pre-register and may be admitted on a daily access pass basis depending on COH capacity and at the discretion of COH management onsite. Daily access pass guests must be accompanied by a full access pass holder.', active: true, template: 'nsf_exec.html' },
        { type: 'COC/COF Executive Staff or Board Member', value: 'exec', note: null, active: true, template:'exec.html'},
        { type: 'Guest of COC/COF Executive Staff or Board Member', value: 'coc_guest', note: 'A maximum of four (4) guests per individual or group can be registered for COH.  All will receive full access passes. Additional guests must pre-register and may be admitted on a daily access pass basis depending on COH capacity and at the discretion of COH management onsite. Daily access pass guests must be accompanied by a full access pass holder.', active: true, template:'coc_guest.html'},
        { type: 'National or International Olympic Committee', value: 'oc', note: 'A maximum of four (4) guests per individual or group can be registered for COH.  All will receive full access passes.', active: true, template:'oc.html'},
        { type: 'Olympic Family Sponsor', value: 'sponsor', note: null, active: true, template:'sponsor.html'},
        { type: 'Government Partner (Canadian Embassy, Federal, Municipal, Provincial, etc.)', value: 'government', note: null, active: true, template:'government.html'},
        { type: 'Sport Partner (CSI, OTP, etc.)', value: 'partner', note: 'A maximum of four (4) guests per individual or group can be registered for COH.  All will receive full access passes.', active: true, template:'partner.html'},
        { type: 'Athlete Representative', value: 'rep', note: 'A maximum of one (1) athlete representative per athlete can be registered for COH on a full access pass.', active: true, template:'rep.html'},
        { type: 'Sochi 2014 NSF Accredited (Ao or P) Olympic Team Member', value: null, note: null, active: false, template:'blank.html'},
        { type: 'Sochi 2014 Olympic Team Athlete', value: null, note: null, active: false, template:'blank.html'},
        { type: 'Sochi 2014 Olympic Team Coach', value: null, note: null, active: false, template:'blank.html'},
        { type: 'Sochi 2014 Canadian Competition Official', value: null, note: null, active: false, template:'blank.html'},
        { type: 'Sochi 2014 Mission Team Member', value: null, note: null, active: false, template:'blank.html'},
        { type: 'Media (Accredited/Non-Accreditated, ENS)', value: 'media', note: 'FOR MEDIA REGISTRATION TO EVENTS AT CANADA OLYMPIC HOUSE, PLEASE CONTACT JANE ALMEIDA AT <a href="mailto:jalmeida@olympic.ca">JALMEIDA@OLYMPIC.CA</a>', active:false, template:'blank.html'},
        { type: 'Other', note: 'If none of the categories in the dropdown list above define your affiliation, please be as specific as possible in describing your relationship to the Canadian Olympic Team. Submissions will be taken under review by the Canadian Olympic Committee, but do not guarantee access to Canada Olympic House.', active: true, template:'blank.html'}
    ];
    $scope.sports = [
        { type: 'Alpine Skiing', value: 'Alpine Skiing' },
        { type: 'Ski Cross', value: 'Ski Cross' },
        { type: 'Athletics', value: 'Athletics' },
        { type: 'Badminton', value: 'Badminton' },
        { type: 'Baseball', value: 'Baseball' },
        { type: 'Biathlon', value: 'Biathlon' },
        { type: 'Bobsleigh', value: 'Bobsleigh' },
        { type: 'Skeleton', value: 'Skeleton' },
        { type: 'Basketball', value: 'Basketball' },
        { type: 'Snowboard', value: 'Snowboard' },
        { type: 'Football', value: 'Football' },
        { type: 'Boxing', value: 'Boxing' },
        { type: 'Wrestling', value: 'Wrestling' },
        { type: 'Curling', value: 'Curling' },
        { type: 'Freestyle Skiing', value: 'Freestyle Skiing' },
        { type: 'Luge', value: 'Luge' },
        { type: 'Modern Pentathlon', value: 'Modern Pentathlon' },
        { type: 'Table Tennis', value: 'Table Tennis' },
        { type: 'Handball', value: 'Handball' },
        { type: 'Water Polo', value: 'Water Polo' },
        { type: 'Weightlifting', value: 'Weightlifting' },
        { type: 'Fencing', value: 'Fencing' },
        { type: 'Canoe-Kayak', value: 'Canoe-Kayak' },
        { type: 'Cross Country Skiing', value: 'Cross Country Skiing' },
        { type: 'Cycling', value: 'Cycling' },
        { type: 'Diving', value: 'Diving' },
        { type: 'Equestrian', value: 'Equestrian' },
        { type: 'Archery', value: 'Archery' },
        { type: 'Field Hockey', value: 'Field Hockey' },
        { type: 'Gymnastics', value: 'Gymnastics' },
        { type: 'Ice Hockey', value: 'Ice Hockey' },
        { type: 'Judo', value: 'Judo' },
        { type: 'Nordic Combined', value: 'Nordic Combined' },
        { type: 'Rowing', value: 'Rowing' },
        { type: 'Rugby', value: 'Rugby' },
        { type: 'Sailing', value: 'Sailing' },
        { type: 'Shooting', value: 'Shooting' },
        { type: 'Figure Skating', value: 'Figure Skating' },
        { type: 'Ski Jumping', value: 'Ski Jumping' },
        { type: 'Short Track Speed Skating', value: 'Short Track Speed Skating' },
        { type: 'Long Track Speed Skating', value: 'Long Track Speed Skating' },
        { type: 'Swimming', value: 'Swimming' },
        { type: 'Synchronised Swimming', value: 'Synchronised Swimming' },
        { type: 'Tennis', value: 'Tennis' },
        { type: 'Triathlon', value: 'Triathlon' },
        { type: 'Volleyball', value: 'Volleyball' },
        { type: 'Taekwondo', value: 'Taekwondo' }
    ];
    $scope.winterSports = [
        { type: 'Alpine Skiing', value: 'Alpine Skiing' },
        { type: 'Ski Cross', value: 'Ski Cross' },
        { type: 'Bobsleigh', value: 'Bobsleigh' },
        { type: 'Skeleton', value: 'Skeleton' },
        { type: 'Snowboard', value: 'Snowboard' },
        { type: 'Curling', value: 'Curling' },
        { type: 'Freestyle Skiing', value: 'Freestyle Skiing' },
        { type: 'Luge', value: 'Luge' },
        { type: 'Cross Country Skiing', value: 'Cross Country Skiing' },
        { type: 'Ice Hockey', value: 'Ice Hockey' },
        { type: 'Nordic Combined', value: 'Nordic Combined' },
        { type: 'Figure Skating', value: 'Figure Skating' },
        { type: 'Ski Jumping', value: 'Ski Jumping' },
        { type: 'Short Track Speed Skating', value: 'Short Track Speed Skating' },
        { type: 'Long Track Speed Skating', value: 'Long Track Speed Skating' },
        { type: 'Biathlon', value: 'Biathlon' }
    ];
    $scope.nsfRelationships = [
        { type: 'President', value: 'President' },
        { type: 'CEO or Executive Director', value: 'CEO or Executive Director' },
        { type: 'Board Member', value: 'Board Member' },
        { type: 'Technical Support Team', value: 'Technical Support Team' },
        { type: 'Athlete Alternate / Training Partner', value: 'Athlete Alternate / Training Partner' },
        { type: 'Other' }
    ];
    $scope.nsfs = [
        { type: 'Alpine Canada', value: 'Alpine Canada' },
        { type: 'Athletics Canada', value: 'Athletics Canada' },
        { type: 'Badminton Canada', value: 'Badminton Canada' },
        { type: 'Baseball Canada', value: 'Baseball Canada' },
        { type: 'Biathlon Canada', value: 'Biathlon Canada' },
        { type: 'Bobsleigh Canada Skeleton', value: 'Bobsleigh Canada Skeleton' },
        { type: 'Canada Basketball', value: 'Canada Basketball' },
        { type: 'Canada Snowboard', value: 'Canada Snowboard' },
        { type: 'Canadian Amateur Boxing Association', value: 'Canadian Amateur Boxing Association' },
        { type: 'Canadian Amateur Wrestling Association', value: 'Canadian Amateur Wrestling Association' },
        { type: 'Canadian Canoe Association', value: 'Canadian Canoe Association' },
        { type: 'Canadian Curling Association', value: 'Canadian Curling Association' },
        { type: 'Canadian Fencing Federation', value: 'Canadian Fencing Federation' },
        { type: 'Canadian Freestyle Ski Association', value: 'Canadian Freestyle Ski Association' },
        { type: 'Canadian Luge Association', value: 'Canadian Luge Association' },
        { type: 'Canadian Modern Pentathlon Association', value: 'Canadian Modern Pentathlon Association' },
        { type: 'Canadian Soccer Association', value: 'Canadian Soccer Association' },
        { type: 'Canadian Table Tennis Association', value: 'Canadian Table Tennis Association' },
        { type: 'Canadian Team Handball Federation', value: 'Canadian Team Handball Federation' },
        { type: 'Canadian Tenpin Federation', value: 'Canadian Tenpin Federation' },
        { type: 'Canadian Water Polo Association', value: 'Canadian Water Polo Association' },
        { type: 'Canadian Weightlifting Federation', value: 'Canadian Weightlifting Federation' },
        { type: 'Cross Country Canada', value: 'Cross Country Canada' },
        { type: 'Cycling Canada Cyclisme', value: 'Cycling Canada Cyclisme' },
        { type: 'Diving Plongeon Canada', value: 'Diving Plongeon Canada' },
        { type: 'Equine Canada', value: 'Equine Canada' },
        { type: 'Federation of Canadian Archers', value: 'Federation of Canadian Archers' },
        { type: 'Field Hockey Canada', value: 'Field Hockey Canada' },
        { type: 'Golf Canada', value: 'Golf Canada' },
        { type: 'Gymnastics Canada', value: 'Gymnastics Canada' },
        { type: 'Hockey Canada', value: 'Hockey Canada' },
        { type: 'Judo Canada', value: 'Judo Canada' },
        { type: 'Karate Canada', value: 'Karate Canada' },
        { type: 'Nordic Combined Ski Canada', value: 'Nordic Combined Ski Canada' },
        { type: 'Racquetball Canada', value: 'Racquetball Canada' },
        { type: 'Roller Sports Canada', value: 'Roller Sports Canada' },
        { type: 'Rowing Canada Aviron', value: 'Rowing Canada Aviron' },
        { type: 'Rugby Canada', value: 'Rugby Canada' },
        { type: 'Sail Canada', value: 'Sail Canada' },
        { type: 'Shooting Federation of Canada', value: 'Shooting Federation of Canada' },
        { type: 'Skate Canada', value: 'Skate Canada' },
        { type: 'Ski Jumping Canada', value: 'Ski Jumping Canada' },
        { type: 'Softball Canada', value: 'Softball Canada' },
        { type: 'Speed Skating Canada', value: 'Speed Skating Canada' },
        { type: 'Squash Canada', value: 'Squash Canada' },
        { type: 'Swimming Canada', value: 'Swimming Canada' },
        { type: 'Synchro Canada', value: 'Synchro Canada' },
        { type: 'Tennis Canada', value: 'Tennis Canada' },
        { type: 'Triathlon Canada', value: 'Triathlon Canada' },
        { type: 'Volleyball Canada', value: 'Volleyball Canada' },
        { type: 'Water Ski and Wakeboard Canada', value: 'Water Ski and Wakeboard Canada' },
        { type: 'WTF Taekwondo Association of Canada', value: 'WTF Taekwondo Association of Canada' }
    ];
    $scope.winterNsfs = [];
    $scope.fx = [
        { type: 'Overall', value: 'Overall' },
        { type: 'Canada Olympic House', value: 'Canada Olympic House' },
        { type: 'Communications', value: 'Communications' },
        { type: 'Contracted Personnel', value: 'Contracted Personnel' },
        { type: 'Health and Science ', value: 'Health and Science ' },
        { type: 'Outfitting Operations', value: 'Outfitting Operations' },
        { type: 'Performane Centre', value: 'Performane Centre' },
        { type: 'Sport Services', value: 'Sport Services' },
        { type: 'Village Operations | Team Services', value: 'Village Operations | Team Services' }
    ];

    $scope.cocRelationships = [
        { type: 'Corporate Operations', value: 'Corporate Operations' },
        { type: 'Canadian Olympic Committee Board Member', value: 'Canadian Olympic Committee Board Member' },
        { type: 'Canadian Olympic Committee Foundation Board Member', value: 'Canadian Olympic Committee Foundation Board Member' },
        { type: 'Contacted Personnel', value: 'Contacted Personnel' },
        { type: 'Other' }
    ];
    $scope.execRelationships = [
        { type: 'Canadian Olympic Committee Executive Staff', value: 'Canadian Olympic Committee Executive Staff' },
        { type: 'Canadian Olympic Committee Board Member', value: 'Canadian Olympic Committee Board Member' },
        { type: 'Canadian Olympic Foundation Board Member', value: 'Canadian Olympic Foundation Board Member' }

    ];
    $scope.vips = [
        { type: 'International Olympic Committee Member', value: 'International Olympic Committee Member' },
        { type: 'National Olympic Committee Member (other than Canada)' },
        //{ type: 'VIP', value: 'VIP' },
        //{ type: 'Other'}
    ];
    $scope.relationships = [
        { type: 'Aunt/Uncle', value: 'aunt/uncle' },
        { type: 'Cousin', value: 'cousin' },
        { type: 'Friend', value: 'friend' },
        { type: 'Grandparent', value: 'grandparent' },
        { type: 'Parent', value: 'parent' },
        { type: 'Sibling', value: 'sibling' },
        { type: 'Spouse/Partner', value: 'spouse/partner' },
        { type: 'Other' }
    ];
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
        { type: 'British Columbia', value: 'British Columbia' },
        { type: 'Manitoba', value: 'Manitoba' },
        { type: 'New Brunswick', value: 'New Brunswick' },
        { type: 'Newfoundland & Labrador', value: 'Newfoundland & Labrador' },
        { type: 'Nova Scotia', value: 'Nova Scotia' },
        { type: 'Northwest Territories', value: 'Northwest Territories' },
        { type: 'Nunavut', value: 'Nunavut' },
        { type: 'Prince Edward Island', value: 'Prince Edward Island' },
        { type: 'Ontario', value: 'Ontario' },
        { type: 'Quebec', value: 'Quebec' },
        { type: 'Saskatchewan', value: 'Saskatchewan' },
        { type: 'Yukon', value: 'Yukon' }
    ];
    $scope.governmentAgencies = [
        { type: 'Canadian Embassy', value: 'Canadian Embassy' },
        { type: 'Federal', value: 'Federal' },
        { type: 'Provincial', value: 'Provincial' },
        { type: 'Municipal', value: 'Municipal' },
        { type: 'Other' }
    ];
    $scope.sponsorRelationships = [
        { type: 'Employee', value: 'Employee' },
        { type: 'Employee Guest', value: 'Employee Guest' },
        { type: 'Service Provider / Support Staff', value: 'Service Provider / Support Staff' },
        { type: 'Other' },
    ];
    $scope.sportPartners = [
        { type: 'Coaches of Canada', value: 'Coaches of Canada' },
        { type: 'Own the Podium', value: 'Own the Podium' },
        { type: 'Canadian Sport Institute', value: 'Canadian Sport Institute' },
        { type: 'Other' }
    ];

});