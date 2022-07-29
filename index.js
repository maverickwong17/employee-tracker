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
        type: "input",
        message: "What department does the role belong to?",
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
            console.log(result[0].id)
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
                addRole()
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
 * ok all employees - emp data, id, first/last name, title, dep, salary, manager
 * 
 * ok add dep - name of dep
 * 
 * ok add role - name, salary, dep of the role
 * 
 * add employee - first/last name, role, manager
 * 
 * update employee role - select employee, update w/ new role
 * 
 * Bonus - update emp manager, view by manager, view by departement, delete dep/role/emp, total budget
 */
