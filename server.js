const inquirer = require('inquirer')
const mysql = require('mysql2')
const cTable = require('console.table')

const PORT = process.env.PORT || 3001;


/**
 * init - all dep, all roles, all employees, add dep, add role, add employee, update employee role
 * 
 * all dep - table dep names and dep ids
 * 
 * all roles - job title, role id, what dep, salary
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