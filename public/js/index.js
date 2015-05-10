window.APIURL = ""

angular.module("Creddon", [
  "ui.router",
  "ngImgCrop"
])

.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider){
  $urlRouterProvider.otherwise("/")

  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "templates/home.html"
    })
    .state("cause", {
      url: "/cause/:causeId/:sponsorId",
      templateUrl: "templates/cause.html"
    })
    .state("thank", {
      url: "/thank/:id",
      templateUrl: "templates/thank.html"
    })
}])

.run(["$rootScope", function($rootScope){
  $rootScope.grandTotal = 183735
}])

.controller("homeCtrl", ["$scope", "$httpf", "$state", function($scope, $httpf, $state){

  $scope.goCause = function(cause){
    var sponsors = [],
        sponsorIds = cause.sponsorIds
    for (var i=0;i<sponsorIds.length;i++){
      sponsors.push($scope.sponsors[sponsorIds[i]])
    }

    var total = 0, sponsorTotals = {}
    for (var i=0;i<sponsors.length;i++){
      var sponsor = sponsors[i] // sponsor
      left = sponsor.remaining/sponsor.currentBeneficiaries.length // sponsor left
      sponsorTotals[sponsor.id] = left // register how much each sponsor has left
      total += left // increment total left for sponsors
    }
    var random = Math.random()*(total*2), //*2 because we add base weights worth 50% in total
        offset = total/sponsors.length, //calculate base weight to add to each sponsor
        comparison = 0, //initiate
        sponsorIndex = 0, //initiate
        sponsor = {}
    for (var k in sponsorTotals){
      comparison += (sponsorTotals[k]+offset) //add every sponsor's budget weight & base weight to the previous weights
      if (random < comparison) { sponsor = sponsors[sponsorIndex]; break } //stop after first success
      sponsorIndex++ //increment arrayIndex
    }

    $state.go("cause", {causeId: cause.id, sponsorId: sponsor.id})
  }

  $httpf.get(APIURL+"/causes/").success(function(data){
    $scope.causes = data
  }).error(log)
  $httpf.get(APIURL+"/sponsors/").success(function(data){
    $scope.sponsors = data
  }).error(log)
  $httpf.get(APIURL+"/sponsorImages/").success(function(data){
    $scope.sponsorImages = data
  }).error(log)
  $httpf.get(APIURL+"/sponsorLinks/").success(function(data){
    $scope.sponsorLinks = data
  }).error(log)
  // $scope.tw = false
  // $scope.fb = false
  // $scope.ig = false
  // $scope.selectCause = function(cause) {
  //   $scope.selectedCause = cause
  //   angular.element("#file-reader").trigger("click")
  // }
  // $scope.share = function(){
  //   $http({
  //     type: "POST",
  //     url: "https://creddon.com/crop",
  //     data: {img: $scope.image, logo: $scope.selectedCause.logo, tw: $scope.tw, fb: $scope.fb, ig: $scope.ig}
  //   })
  // }
  // angular.element(document.querySelector("#file-reader")).on("change", function(e){
  //   var file = e.currentTarget.files[0],
  //       reader = new FileReader()
  //   reader.onload = function(e){
  //     $scope.image = e.target.result
  //     $scope.$apply()
  //   }
  //   reader.readAsDataURL(file)
  // })

}])





.controller("causeCtrl", ["$scope", "$httpf", "$state", "$stateParams", function($scope, $httpf, $state, $stateParams){
  $scope.tweet = function(){
    $httpf.post(APIURL+"/tweet/", {id: $scope.cause.id, caption: $scope.caption}).success(function(data){
      $state.go("thank", {id: $stateParams.id})
    }).error(log)
  }

  $httpf.get(APIURL+"/causes/"+$stateParams.causeId).success(function(data){
    $scope.cause = data
  }).error(log)
  $httpf.get(APIURL+"/sponsors/"+$stateParams.sponsorId).success(function(data){
    $scope.sponsor = data
  }).error(log)
}])





.controller("thankCtrl", ["$scope", "$httpf", "$stateParams", function($scope, $httpf, $stateParams){
  $httpf.get(APIURL+"/causes/"+$stateParams.id).success(function(data){
    $scope.cause = data
  }).error(log)
}])























.service("$httpf", [function(){
  this.api = window.$apif = {
    "causes": [undefined,
      {"id":1, "sponsorIds":[1,2,3,5], "name":"Effect", "headline":"Nepal Earthquake Relief", "total": 303875, "link":"", "description":"Effect built NepalRises.com in 8 hours and a bot scanning Twitter @nepalrises to understand who needs help and act immediately. For many, Effect is the first to provide aid. \"I know the Effect team personally, and have met many of the local Nepali volunteers that banded together to launch Nepalrises.com. I'm confident that the money is going directly towards purchasing food, temporary shelter & medical equipment.\"— Elyse May @elyserobyn"},
      {"id":2, "sponsorIds":[1,3,4,5], "name":"Girls Who Code", "headline":"Gender Parity in Tech", "total": 23098, "link":"", "description":"Girls Who Code works to educate, inspire, and equip high school girls with the skills and resources to pursue opportunities in computing fields."},
      {"id":3, "sponsorIds":[1,3,5], "name":"Kiva","headline":"Poverty Alleviation", "total": 163083, "link":"", "description":"Kiva's mission is to connect people through lending to alleviate poverty. Through Kiva, individuals can lend as little as $25 to help create opportunity around the world."},
      {"id":4, "sponsorIds":[1,3,4,5], "name":"Watsi","headline":"Life-changing Healthcare", "total": 97856, "link":"", "description":"Watsi is a global crowdfunding platform that enables anyone to donate as little as $5 to directly fund life-changing healthcare for people in need."},
    ],
    "tweet":[],
    "sponsorImages":["home-lab360-logo.png", "home-startuphouse-logo.png", "home-anonymous-logo.png", "home-bebo-logo.png", "home-trackduck-logo.jpg", "home-careerdean-logo.png", "home-rhsfinancial-logo.jpg"],
    "sponsorLinks":["http://lab360.com/", "http://startuphouse.com/", "", "http://bebo.com/", "http://trackduck.com/", "http://careerdean.com/", "http://rhsfinancial.com/"],
    "beneficiaries": ["",{
      id: 1,
      name: "Effect International",
      url: "http://effect.org/",
      twitter: "@effectint",
      received: 0,
      due: 0
    }, {
      id: 2,
      name: "Girls Who Code",
      url: "http://girlswhocode.com/",
      twitter: "@GirlsWhoCode",
      received: 0,
      due: 0
    }, {
      id: 3,
      name: "Kiva",
      url: "http://kiva.org/",
      twitter: "@Kiva",
      received: 64,
      due: 0
    }, {
      id: 4,
      name: "Watsi",
      url: "http://watsi.org/",
      twitter: "@watsi",
      received: 0,
      due: 0
    }],
    "sponsors": ["",{
      id: 1,
      name: "Bebo",
      url: "http://bebo.com/",
      twitter: "@Bebo_Official",
      currentBeneficiaries: [1,2,3,4],
      remaining: 72,
      owes: 28,
      paid: 0
    }, {
      id: 2,
      name: "Elyse",
      url: "Anonymous",
      twitter: "Anonymous",
      currentBeneficiaries: [1],
      remaining: 200,
      owes: 0,
      paid: 0
    }, {
      id: 3,
      name: "Lab360",
      url: "http://lab360.com",
      twitter: "",
      currentBeneficiaries: [1,2,3,4],
      remaining: 1000,
      owes: 0,
      paid: 0
    }, {
      id: 4,
      name: "StartupHouse",
      url: "http://startuphouse.com",
      twitter: "@StartupHouse",
      currentBeneficiaries: [2,4],
      remaining: 200,
      owes: 0,
      paid: 67
    }, {
      id: 5,
      name: "TrackDuck",
      url: "http://trackduck.com",
      twitter: "@TrackDuck",
      currentBeneficiaries: [1,2,3,4],
      remaining: 84,
      owes: 16,
      paid: 0
    }]
  }





  /* Pathval for fake api. I modified it for browser. Original: chaijs/pathval */var pathval=function(){function e(e,n){var t=r(n);return i(t,e)}function n(e,n,i){var p=r(n);t(p,i,e)}function r(e){for(var n=(e||"").replace(/\[/g,".["),r=n.match(/(\\\.|[^.]+?)+/g),i=/\[(\d+)\]$/,t=[],p=null,a=0,f=r.length;f>a;a++)p=i.exec(r[a]),t.push(p?{i:parseFloat(p[1])}:{p:r[a]});return t}function i(e,n){for(var r,i=n,t=0,a=e.length;a>t;t++){var f=e[t];i?(p(f.p)?i=i[f.p]:p(f.i)&&(i=i[f.i]),t==a-1&&(r=i)):r=void 0}return r}function t(e,n,r){for(var i,t=r,a=0,f=e.length;f>a;a++)if(i=e[a],p(t)&&a==f-1){var u=p(i.p)?i.p:i.i;t[u]=n}else if(p(t))if(p(i.p)&&t[i.p])t=t[i.p];else if(p(i.i)&&t[i.i])t=t[i.i];else{var o=e[a+1],u=p(i.p)?i.p:i.i,l=p(o.p)?{}:[];t[u]=l,t=t[u]}else a==f-1?t=n:p(i.p)?t={}:p(i.i)&&(t=[])}function p(e){return!(!e&&"undefined"==typeof e)}return{parse:r,set:n,get:e}}();
  function filterByQuery(set, properties) {
    return set.filter(function (entry) {
      return Object.keys(properties).every(function (key) {
        return similar(entry[key], properties[key])
      })
    })
  }
  function similar(v1, v2){
    return (v1+"").toLowerCase().indexOf((v2+"").toLowerCase()) != -1
  }

  function serverInfo(){return {"date": Date.now(),"server": "$httpf","connection": "close"}}
  function requestInfo(method, url, data){
    return {
      method: "POST",
      headers: {"HTTPF-HEADERS": 0},
      url: url,
      data: data
    }
  }

  this.success = function(fn){
    if (this.vals) fn.apply({}, this.vals)
    return this
  }

  this.error = function(fn){
    if (this.errs) fn.apply({}, this.errs)
    return this
  }

  this.post = function(route, data){
    var oroute = route
    try {
      if (route.slice(0, 1) === "/") route = route.slice(1)
      var path = route.split("/").join(".")
      if (path.slice(-1) === ".") {         // collection
        path = path.slice(0, -1)
        var ar = pathval.get(this.api, path)
        ar.push(data)
        data = ar
      }
      pathval.set(this.api, path, data)
      this.vals = [{ok: 1, n: 0, err: null, errmsg: null}, 200, serverInfo, requestInfo("POST", oroute, data)]
    } catch (e) {
      this.errs = [JSON.stringify(e), 400, serverInfo, requestInfo("POST", oroute, data)]
    }
    return this
  }


  this.get = function(route){
    var oroute = route,
        query  = {}                 // Init query object
    try {
      if (route.slice(-1) === "/") route = route.slice(0, -1)
      if (route.slice(0, 1) === "/") route = route.slice(1)
      if (route.indexOf("?") >= 0) {    // Check for qs
        var parts = route.split("?"),   // Split to [route, qs]
            qstr  = parts.slice(-1)[0], // Get qs
            amp   = qstr.split("&")     // Split each query
        for (var i in amp) {
          var b = amp[i].split("=")     // Split/assign k & v to query object after decode
          query[decodeURIComponent(b[0])] = decodeURIComponent(b[1])
        }
        route = parts[0] // Re-assign route variable to route without a qs
      }
      var res = pathval.get(this.api, route.split("/").join(".")) // Map route to json api
      if (Array.isArray(res) && query) {       // Collection and qs?
        if (typeof query.q === "string") {     // Check if full text search
          var newRes = []
          for (var i=0;i<res.length;i++) {     // Iterate through objects & attrs
            var ob = res[i]
            for (var k in ob) {
              if (similar(ob[k], query.q)) {   // Check if val exists, case insensitive
                newRes.push(ob)                // Break & push when match
                break
              }
            }
          }
          if (Object.keys(query).length > 1) { // Check if other qs k's & v's aside from q
            delete query.q                     // Delete q and filter by other k's & v's
            newRes = filterByQuery(newRes, query)
          }
          res = newRes
        } else if (query) {               // Else if qs, but not collection
          res = filterByQuery(res, query) // Match via qs
        }
      }
      if (!res) throw new Error(404)
      this.vals = [res, 200, serverInfo, requestInfo("GET", oroute, query)]          // Should clone query to make query.q show up here
    } catch(e) {
      this.errs = ["Not Found", 404, serverInfo, requestInfo("GET", oroute, query)]
    }
    return this
  }
}])

function log(a,b,c,d){console.log("<----- START LOG ----->");console.log(a,b);if(c||d){console.log(c||null,d||null)}console.log("<------ END LOG ------>")}
