    // use db query
const inquirer = require('inquirer')
const mysql = require('mysql2')
const cTable = require('console.table')
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
  console.log(`Connected to the books_db database.`)
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
    // db.query("SELECT employees.id, first_name, last_name, roles.title, roles.salary, employees.manager_id AS manager FROM employees JOIN roles ON employees.role_id = roles.id", (err, result)=>{
    db.query("SELECT employees.id, first_name, last_name, roles.title, departments.department roles.salary, employees.manager_id AS manager FROM employees JOIN roles ON employees.role_id = roles.id", (err, result)=>{
        if(err){
            console.log(err);
        }
        console.table(result)
        viewAll()
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
                console.log("c")
                break
            case "Add Department":
                console.log("d")
                break
            case "Add Role":
                console.log("e")
                break
            case "Add Employee":
                console.log("f")
                break
            case "Update Employee Role":
                console.log("g")
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
 * all employees - emp data, id, first/last name, title, dep, salary, manager
 * 
 * add dep - name of dep
 * 
 * add role - name, salary, dep of the role
 * 
 * add employee - first/last name, role, manager
 * 
 * update employee role - select employee, update w/ new role
 * 
 * Bonus - update emp manager, view by manager, view by departement, delete dep/role/emp, total budget
 */
