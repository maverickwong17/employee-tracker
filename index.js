    // use db query
const inquirer = require('inquirer')
const mysql = require('mysql2')
const cTable = require('console.table');
const { type } = require('os');
// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

const allDep = () => {
    db.query("SELECT * FROM departments", (err, result)=>{
        if(err){
            console.log(err);
        }
        console.table(result)
        viewAll()
    })
}

const allRoles = () => {
    db.query("SELECT roles.title, roles.salary, departments.department FROM roles JOIN departments ON roles.department_id = departments.id", (err, result)=>{
        if(err){
            console.log(err);
        }
        console.table(result)
        viewAll()
    })
}

const allEmployees = () => {
    db.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON m.id = employees.manager_id", (err, result)=>{
        if(err){
            console.log(err);
        }
        console.table(result)
        viewAll()
    })
}

const addDep = () => {
    inquirer.prompt([
        {
        type: "input",
        message: "What is the name of the department?",
        name: "depName"
        }
    ])
    .then((response)=>{
        let depoName = response.depName
        db.query("INSERT INTO departments(department) VALUES (?)", depoName,(err, result)=>{
            if(err){
                console.log(err);
            }
            console.log("Successfully Added!")
            viewAll()
        })
    })
}

var depArr = []
function getDep(){
    db.query("SELECT * FROM departments", (err, result) =>{
        if(err){
            console.log(err)
        }
        for(let i = 0; i < result.length ; i++){
            depArr.push(result[i].department)
        }
    })
    return depArr
}

const addRole = () => {
    inquirer.prompt([
        {
        type: "input",
        message: "What is the title of the role?",
        name: "title"
        },
        {
        type: "number",
        message: "What is the salary of the role?",
        name: "salary"
        },
        {
        type: "list",
        message: "What department does the role belong to?",
        choices: depArr,
        name: "depName"
        }
    ])
    .then((response)=>{
        let {title, salary, depName} = response
        let depId
        db.query("SELECT id FROM departments where department = ?", depName, (err, result)=>{
            if(err){
                console.log(err)
            }
            depId = result[0].id
            db.query("INSERT INTO roles(title,salary,department_id) VALUES (?,?,?)", [title, salary, depId], (err, result)=>{
                    if(err){
                        console.log(err)
                    }
                    console.log("Successfully Added!")
                    viewAll()
                })
        })
        })
}

var  roleArr= []
function getRoles(){
    db.query("SELECT * FROM roles", (err, result) =>{
        if(err){
            console.log(err)
        }
        for(let i = 0; i < result.length ; i++){
            roleArr.push(result[i].title)
        }
    })
    return roleArr
}

const addEmployee = () => {
    inquirer.prompt([
        {
        type: "input",
        message: "What is the first name of the employee?",
        name: "firstName"
        },
        {
        type: "input",
        message: "What is the last name of the employee?",
        name: "lastName"
        },
        {
        type: "list",
        message: "What is the role of the employee?",
        choices: roleArr,
        name: "role"
        },
        {
        type: "input",
        message: "Does this employee have a manager?(leave blank if no manager)",
        name: "manager"
        }
    ])
    .then((response)=>{
        console.log(response)
        let {firstName, lastName, role, manager} = response
        if (manager === ''){manager = null}
        db.query("SELECT id FROM roles where title = ?", role, (err, result)=>{
            if(err){
                console.log(err)
            }
            let roleId = result[0].id
            db.query("INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [firstName,lastName, roleId, manager], (err, result)=>{
                if(err){
                    console.log(err)
                }
                console.log("Successfully Added!")
                viewAll()
            })
        })
        })
}

var  empArr= []
// function getEmployees(){
const upEmployee = () => {
    db.query("SELECT * FROM employees", (err, result) =>{
        if(err){
            console.log(err)
        }
        for(let i = 0; i < result.length ; i++){
            let name = result[i].first_name + " " + result[i].last_name
            empArr.push(name)
        }
        inquirer.prompt([
            {
                type: 'list',
                message: "Which employee's role do you want to update?",
                choices: empArr,
                name: 'employee',
            },
            {
                type: "list",
                message: "What is the new role of the employee?",
                choices: roleArr,
                name: "role"
            },
        ])
        .then((response) =>{
            const {employee, role} = response
            let nameArr= employee.split(' ')
            console.log(nameArr)
            first = nameArr[0]
            db.query("SELECT id FROM employees where first_name = ?",first,(err, result) =>{
                if(err){
                    console.log(err)
                }
                console.log(result, 'emp result')
                employeeID = result[0].id
                db.query("SELECT id FROM roles where title = ?",role,(err, result) =>{
                    if(err){
                        console.log(err)
                    }
                    console.log(result, 'title res')
                    roleID = result[0].id
                    db.query("UPDATE employees SET role_id = ? WHERE id = ?",[roleID, employeeID],(err, result) =>{
                        if(err){
                            console.log(err)
                        }
                        console.log(result)
                    })
                })
            })
                viewAll()
                })
    })
    }

const viewAll = () => {
    inquirer.prompt([
        {
        type: 'list',
        message: "What would you like to do?",
        choices: ["View All Departments","View All Roles","View All Employees","Add Department","Add Role","Add Employee","Update Employee Role", "Exit"],
        name: 'action',
        }
    ])
    .then((response) =>{
        let action = response.action
        switch(action){
            case "View All Departments":
                allDep()
                break
            case "View All Roles":
                allRoles()
                break
            case "View All Employees":
                allEmployees()
                break
            case "Add Department":
                addDep()
                break
            case "Add Role":
                getDep()
                addRole()
                break
            case "Add Employee":
                getRoles()
                addEmployee()
                break
            case "Update Employee Role":
                // getEmployees()
                getRoles()
                upEmployee()
                break
            default:
                console.log("exit")
                process.exit(0)
            }
        })
    }

    
function init(){
    viewAll()
}

init()
/**
 * ok init - all dep, all roles, all employees, add dep, add role, add employee, update employee role
 * 
 * ok all dep - table dep names and dep ids
 * 
 * ok all roles - job title, role id, what dep, salary
 * 
 * ok all employees - emp data, id, first/last name, title, dep, salary, manager
 * 
 * ok add dep - name of dep
 * 
 * ok add role - name, salary, dep of the role
 * 
 * ok add employee - first/last name, role, manager
 * 
 * update employee role - select employee, update w/ new role
 * 
 * Bonus - update emp manager, view by manager, view by departement, delete dep/role/emp, total budget
 */
