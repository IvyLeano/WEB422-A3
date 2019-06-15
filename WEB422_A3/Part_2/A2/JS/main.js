/********************************************************************************* *
WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. * No part
of this assignment has been copied manually or electronically from any other source * (including web
sites) or distributed to other students.
*
* Heroku link: https://fierce-ridge-73424.herokuapp.com
* Name: ___Ivy Leano - Hill___________________ Student ID: ________120331186______ Date: ______05/28/2019__________
*
*
********************************************************************************/
//Note: $.ajax: https://www.w3schools.com/jquery/ajax_ajax.asp
//              https://api.jquery.com/jquery.get/

$(document).ready(function () {
  console.log("Document Ready");
  let employeesModel = [];
  intializeEmployeesModel();

  $("#employee-search").on("keyup", function () {
    var filtered = getFilteredEmployeesModel(this.value);
    refreshEmployeeRows(filtered);
  });
  
  $(document.body).on('click', '.body-row', function () {
    var emp = getEmployeeModelById($(this).attr("data-id"));
    var isEmpEmpty = emp == null;
    var template;
    var content;
    if (!isEmpEmpty) {
      emp.HireDate = moment(emp.HireDate).format('LL');
      template = _.template(
        '<strong>Address:</strong> <%- employee.AddressStreet %> <%- employee.AddressCity %>, <%- employee.AddressState %>. <%- employee.AddressZip %></br>' +
        '<strong>Phone Number:</strong> <%- employee.PhoneNum %> ext: <%- employee.Extension %></br>' +
        '<strong>Hire Date:</strong> <%- employee.HireDate %>'
      );
      content = template({ 'employee': emp });
      showGenericModal(emp.FirstName + ' ' + emp.LastName, content);
    }
  });
});

function intializeEmployeesModel() {
  $.ajax({
    url: "https://fierce-ridge-73424.herokuapp.com/employees",
    type: "GET",
    contentType: "application/json"
  }).done(function (data) {
    employeesModel = data;
    refreshEmployeeRows(employeesModel);
  }).fail(function (err) {
    showGenericModal('Error', 'Unable to get Employees');
  });
}

function showGenericModal(title, message) {
  $("#genericModal .modal-title").append(title);
  $("#genericModal .modal-body").append(message);
  $("#genericModal").modal('show');
};

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
    var lastName =  emp.LastName.toLowerCase().includes(filterString.toLowerCase());
    var position = emp.Position.PositionName.toLowerCase().includes(filterString.toLowerCase());
    return (firstName || lastName || position) ? true : false;
  });
  return filteredEmployeesModel;
};

function getEmployeeModelById(id) {
  var data = null;
  $.grep(employeesModel, function (x) {
   if(x._id == id) {
     data = _.cloneDeep(x);
   } 
  });
  return data;
}





