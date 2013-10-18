'use strict';

/* Controllers-- */

var releaseNotesApp = angular.module('releaseNotesApp', []);
var jiraAPIHome = 'http://gbweb:8081/rest/api/2/'

releaseNotesApp.controller('ReleaseNotesCtrl', function ReleaseNotesCtrl($scope, $http) {

  var projectURL = jiraAPIHome + 'project/?jsonp-callback=JSON_CALLBACK'
  $http.jsonp(projectURL).
    success(function(data) {
       $scope.jiraProjects = data;
    });  

  $scope.fetchProject = function(){
    var projectURL = jiraAPIHome + 'project/'+$scope.selectedProject.key+'/?jsonp-callback=JSON_CALLBACK'
    $http.jsonp(projectURL).
      success(function(data) {
        $scope.availableProject = data;
      });    
      console.log($scope.availableProject);
  }
  
  $scope.fetchIssuesBROKEN = function() {
    var baseSearchURL = jiraAPIHome + 'search?jsonp-callback=JSON_CALLBACK'
    $scope.issueTypeIssues = [];
    
    angular.forEach($scope.selectedIssueTypes, function(value, key) {
      var jql = '&jql=project+%3D+'+$scope.selectedProject.key+'+AND+fixVersion+%3D+'+$scope.selectedVersion.id+'+and+type+%3D+'+value.id+'+ORDER+BY+key'
      var selectedTypeIssues = [];
      $http.jsonp(baseSearchURL+jql).
        success(function(data) {
            $scope.issueTypeIssues.push(data.issues);
        });
    });
    
    console.log($scope.issueTypeIssues);
  }
  
  $scope.fetchIssues = function() {
    var baseSearchURL = jiraAPIHome + 'search?jsonp-callback=JSON_CALLBACK'
    var selectedTypes = "";
    angular.forEach($scope.selectedIssueTypes, function(value, key) {
      selectedTypes = selectedTypes + value.id + ',+';
    }, selectedTypes);
    
    var jql = '&jql=project+%3D+'+$scope.selectedProject.key+'+AND+fixVersion+%3D+'+$scope.selectedVersion.id+'+and+type+IN+('+String(selectedTypes).substring(0,selectedTypes.length-2)+')+ORDER+BY+key'
    
    $http.jsonp(baseSearchURL+jql).
      success(function(data) {
         $scope.allIssues = data.issues;
      });
  }  
});

