/********************************************************************************* *
WEB422 – Assignment 3
* Heroku link: https://fierce-ridge-73424.herokuapp.com
* Date: ______05/28/2019__________
*
*
********************************************************************************/
//Note: $.ajax: https://www.w3schools.com/jquery/ajax_ajax.asp
//              https://api.jquery.com/jquery.get/

 //object viewModel, knockout observable properties/values
 var viewModel = {
  teams: ko.observable([]),
  employees: ko.observable([]),
  projects: ko.observable([])
};

//A3: updated to include initializeTeams() and initializeProjects()
$(document).ready(function() {
  console.log("Document ready");
  initializeTeams()
      .then(
        intializeEmployeesModel
      )
      .then(
        initializeProjects
      )
      .then(function(reject,resolve) {
              ko.applyBindings(viewModel, $("body")[0]);
              $("select.multiple").multipleSelect({filter:true});
              $("select.single").multipleSelect({single:true, filter:true});
          }
      );
});
//A3: initialize projects function added
function initializeProjects() {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: "https://fierce-ridge-73424.herokuapp.com/projects",
      type: "GET",
      contentType: "application/json"
    }).done(function (data) {
      viewModel.projects = ko.mapping.fromJS(data);
      //refreshEmployeeRows(employeesModel);
      resolve();
    }).fail(function (err) {
      // showGenericModal('Error', 'Unable to get Employees');
      reject("Error loading the project data");
    });
  });
}
//A3: initialize teams function added
function initializeTeams() {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: "https://fierce-ridge-73424.herokuapp.com/teams-raw",
      type: "GET",
      contentType: "application/json"
    }).done(function (data) {
    //  console.log(json.parse(data))
    viewModel.teams  = ko.mapping.fromJS(data);
   
      //refreshEmployeeRows(employeesModel);
      resolve();
    }).fail(function (err) {
      // showGenericModal('Error', 'Unable to get Employees');
      reject("Error loading the team data");
    });
  });
}

//A3: updated to return a promise and populate "employees" property
function intializeEmployeesModel() {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: "https://fierce-ridge-73424.herokuapp.com/employees",
      type: "GET",
      contentType: "application/json"
    }).done(function (data) {
      // employeesModel = data;
      //refreshEmployeeRows(employeesModel);
      viewModel.employees = ko.mapping.fromJS(data);
      resolve();
    }).fail(function (err) {
      // showGenericModal('Error', 'Unable to get Employees');
      reject("Error loading the employee data");
    });
  });
}
//A3: same function in A2, no updates
function showGenericModal(title, message) {
  $("#genericModal .modal-title").empty().append(title);
  $("#genericModal .modal-body").append(message);
  $("#genericModal").modal('show');
};

//A3: save team functions
function saveTeam(){
  var currentTeam = this;
  $.ajax({
    url: "https://fierce-ridge-73424.herokuapp.com/team/" + currentTeam._id(),
    type: "Put",
    data: JSON.stringify(
      {
        Projects: currentTeam.Projects(),
        Employees: currentTeam.Employees(),
        TeamLead: currentTeam.TeamLead()
      }
    ),
    contentType: "application/json"
  }).done(function(data){
    showGenericModal("Success", currentTeam.TeamName() + " Updated Successfully");
  }).fail(function(error){
    showGenericModal("Error", "Error updating the team information." );
  });

}
/*
function refreshEmployeeRows(employees) {
  $("#employees-table").empty();
  var lodashTemplate = _.template('<% _.forEach(employees,function(employee){%>' +
    '<div class="row body-row" data-id="<%- employee._id %>">' +
    '<div class="col-xs-4 body-column"><%- _.escape(employee.FirstName) %></div>' +
    '<div class="col-xs-4 body-column"><%- _.escape(employee.LastName) %></div>' +
    '<div class="col-xs-4 body-column"><%- _.escape(employee.Position.PositionName) %></div>' +
    '</div>' +
    '<% }); %>'
  );
  $('#employees-table').append(lodashTemplate({ 'employees': employees }));
};

function getFilteredEmployeesModel(filterString) {
  var filteredEmployeesModel = _.filter(employeesModel, function (emp) {
    var firstName = emp.FirstName.toLowerCase().includes(filterString.toLowerCase());
    var lastName = emp.LastName.toLowerCase().includes(filterString.toLowerCase());
    var position = emp.Position.PositionName.toLowerCase().includes(filterString.toLowerCase());
    return (firstName || lastName || position) ? true : false;
  });
  return filteredEmployeesModel;
};

function getEmployeeModelById(id) {
  var data = null;
  $.grep(employeesModel, function (x) {
    if (x._id == id) {
      data = _.cloneDeep(x);
    }
  });
  return data;
}
*/


