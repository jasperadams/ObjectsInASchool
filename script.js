/*
 * Objects in a School - Jasper Adams - 10/27/17
 */

var students = [];
var teachers = [];
var sections = [];

//starting info
var johnsmith = new Student(12345, 'John', 'Smith', '12');
var jillhill = new Student(13125, 'Jill', 'Hill', '10');
var janedoe = new Teacher(54321, 'Jane', 'Doe', 'Math');
var bobbuilder = new Teacher(78901, 'Bob', 'Builder', 'English');
teachers.push(bobbuilder);
teachers.push(janedoe);
students.push(johnsmith);
students.push(jillhill);
var algebra = new Section("Algebra", 5);
var english = new Section("English", 10);
sections.push(algebra);
sections.push(english);
algebra.addStudent(johnsmith);
english.addStudent(johnsmith);
english.addStudent(jillhill);
algebra.changeTeacher(janedoe);
english.changeTeacher(bobbuilder);

function consoleLog(){
    console.log(algebra.students);
}

function Person(id, firstName, lastName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
}

function Student(id, firstName, lastName, grade) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.grade = grade;
}
Student.prototype = new Person();

function Teacher(id, firstName, lastName, subject) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.subject = subject;
}
Teacher.prototype = new Person();

function Section(secName, maxSize, grdLevel) {
    this.name = secName;
    this.maxSize = maxSize;
    this.students = [];
    this.gradeLevel = grdLevel;
    this.currentsize = this.students.length;
    this.addStudent = function(student){
        this.students.push(student);
    };
    this.changeTeacher = function(teacher){
        this.teacher = teacher;
    };
    this.removeStudent = function(id){
        for(var i = 0; i < this.students.length; i++){
            var obj = this.students[i];
            if(obj.id === id){
                this.students.splice(i,1);
            }
        }
    };
    this.sectionSeatsRemaining = function(){
        return this.maxSize - this.currentsize;
    }
}

function addStudent(){
    var id = document.getElementById("ID").value;
    var fn = document.getElementById("FN").value;
    var ln = document.getElementById("LN").value;
    var grd = document.getElementById("GRD").value;
    if(id === ""){
        alert("You need an ID.");
    }else{
        var x = new Student(id, fn, ln, grd);
    }
    students.push(x);
    addListItem(x, "stuList", "lastName");
    populateTable(students, "stuTable", "lastName", 0);
}

function addTeacher(){
    var id = document.getElementById("ID").value;
    var fn = document.getElementById("FN").value;
    var ln = document.getElementById("LN").value;
    var sub = document.getElementById("SUB").value;
    if(id === ""){
        alert("You need an ID.");
    }else{
        var x = new Teacher(id, fn, ln, sub);
    }
    teachers.push(x);
    addListItem(x, "teachList", "lastName");
    populateTable(teachers, "teachTable", "lastName", 0);
}

function createSection(){
    var secName = document.getElementById("SEC").value;
    var maxSize = document.getElementById("SIZ").value;
    var grd = document.getElementById("GRDLVL").value;
    var x = new Section(secName, maxSize, grd);
    sections.push(x);
    addListItem(x, "secListTeach", "name");
    addListItem(x, "secListStu", "name");
    populateTable(sections, "secTable", "name", 0);
}

function populateList(arr, ID, prop){
    for(var i = 0; i < arr.length; i++){
        var opt = document.createElement("option");
        opt.innerHTML = arr[i][prop];
        document.getElementById(ID).appendChild(opt);
    }
}

function populateLists(){
    populateList(sections, "secListTeach", "name");
    populateList(teachers, "teachList", "lastName");
    populateList(sections, "secListStu", "name");
    populateList(students, "stuList", "lastName");
}

function addListItem(obj, ID, prop){
    var opt = document.createElement("option");
    opt.innerHTML = obj[prop];
    document.getElementById(ID).appendChild(opt);
}

function changeTeacher(){
    var secName = document.getElementById("secListTeach").value;
    var sec = "";
    for(var i = 0; i < sections.length; i++){
        if(sections[i].name === secName){
            sec = sections[i];
        }
    }
    var teachName = document.getElementById("teachList").value;
    var teach = "";
    for(var j = 0; j < teachers.length; j++){
        if(teachers[j].lastName === teachName){
            teach = teachers[j];
        }
    }
    sec.changeTeacher(teach);
}

function addStudentToSection(){
    var secName = document.getElementById("secListStu").value;
    var sec = "";
    var stu = "";
    for (var i = 0; i < sections.length; i++) {
        if (sections[i].name === secName) {
            sec = sections[i];
        }
    }
    var space = sec.sectionSeatsRemaining();
    if(space === 0){
        alert("Section is Full");
    }else{
        var stuName = document.getElementById("stuList").value;
        for (var j = 0; j < students.length; j++) {
            if (students[j].lastName === stuName) {
                stu = students[j];
            }
        }
        if (sec.students.indexOf(stu) === -1) {
            sec.addStudent(stu);
        }
    }
}

function removeStudentFromSection(){
    var secName = document.getElementById("secListStu").value;
    var sec = "";
    var stu = "";
    for(var i = 0; i < sections.length; i++){
        if(sections[i].name === secName){
            sec = sections[i];
        }
    }
    var stuName = document.getElementById("stuList").value;
    for(var j = 0; j < students.length; j++){
        if(students[j].lastName === stuName){
            stu = students[j];
        }
    }
    sec.removeStudent(stu.id);
}


function populateTable(arr, ID, prop, col){
    for(var i = 0; i < arr.length; i++){
        var table = document.getElementById(ID);
        var row = table.insertRow(table.rows.length);
        var name = arr[i][prop];
        if(document.getElementById(name) !== null){ continue; }
        var cell = row.insertCell(col);
        cell.innerHTML = name;
        cell.id = name;
    }
}

function populateTables(){
    populateTable(students, "stuTable", "lastName", 0);
    populateTable(teachers, "teachTable", "lastName", 0);
    populateTable(sections, "secTable", "name", 0);
}

function searchAndPrint(){
    var ind = searchStudents();
    document.getElementById("sectionDiv").style.display = "inline";
    document.getElementById("info").innerHTML = getStudentSections(ind);
}

function searchStudents() {
    var name = document.getElementById("search").value;
    var ind = "";
    for (var i = 0; i < students.length; i++) {
        if(students[i].lastName.toUpperCase() === name.toUpperCase()) {
            ind = i;
            break;
        }
    }
    return ind;
}

function getStudentSections(ind){
    var sectionsForStudent = "";
    var name = students[ind].lastName;
    for(var j = 0; j < sections.length; j++) {
        var sec = sections[j];
        for(var k = 0; k < sec.students.length; k++){
            if(sec.students[k].lastName.toUpperCase() === name.toUpperCase()){
                sectionsForStudent += (sec.name + "<br>");
                break;
            }
        }
    }
    return sectionsForStudent;
}


