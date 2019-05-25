import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, FlatList } from 'react-native';
import Button from './components/button.js';
import ModalTask from './components/modal-task.js';
import ModalEditTask from './components/modal-edit-task.js';
import ListTask from './components/list-task.js';

export default class App extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      showModal: false,
      form: {
        name: "",
        repeat: ""
      },
      taskTemplates: [],
      tasks: [],
      editTask: null
    }
  }
  
  async componentDidMount(){
    const taskTemplatesJSON = await AsyncStorage.getItem('taskTemplates');
    const tasksJSON = await AsyncStorage.getItem('tasks');
    const taskTemplates = JSON.parse(taskTemplatesJSON) ? JSON.parse(taskTemplatesJSON): [];
    const tasks = JSON.parse(tasksJSON) ? JSON.parse(tasksJSON) : [];
    
    const newTasks = taskTemplates.filter( (taskTemplate,index) => {
      const { lastCreated, repeat } = taskTemplate
      const shouldCreate = (Date.now() - lastCreated) >= (repeat * 1000 * 60 * 60 * 24);
      
      if(shouldCreate){
        taskTemplates[index].lastCreated = Date.now();
      }
      return shouldCreate;
    })
    
    newTasks.forEach( task => tasks.push(task));
    
    this.setTasks(tasks);
    this.setTaskTemplates(taskTemplates);    
  }
  
  async setTasks(tasks){
    this.setState({tasks});
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  async setTaskTemplates(taskTemplates){
    this.setState({taskTemplates: taskTemplates});
    await AsyncStorage.setItem('taskTemplates', JSON.stringify(taskTemplates));
  }
  
  createTaskTemplateFromForm(form){
    return {
      id: Date.now(),
      name: form.name,
      repeat: form.repeat,
      lastCreated: null
    }
  }
  
  async createTaskFromTemplateId(id){
    // Find Task Template
    const taskTemplate = this.state.taskTemplates.find(taskTemplate => taskTemplate.id === id);
    const index = this.state.taskTemplates.findIndex( taskTemplate => taskTemplate.id === id);

    // Update Last Created
    taskTemplate.lastCreated = Date.now();
    const taskTemplates = this.state.taskTemplates;
    taskTemplates[index] = taskTemplate;
    this.setTaskTemplates(taskTemplates);
    
    // Create Task
    const task = { id: taskTemplate.id, name: taskTemplate.name, repeat: taskTemplate.repeat };
    // Update Tasks
    this.setTasks([...this.state.tasks,task]);
  }
  
  async saveNewTask(){
    const { form, taskTemplates } = this.state;
    const taskTemplate = this.createTaskTemplateFromForm(form);
    await this.setTaskTemplates([...this.state.taskTemplates,taskTemplate]);
    await this.createTaskFromTemplateId(taskTemplate.id);
    this.cancelNewTask();
  }
  
  async completeTask(taskId){
    const { tasks } = this.state;
    const index = tasks.findIndex( task => task.id === taskId);
    tasks.splice(index,1);
    await this.setTasks(tasks);
  }
  
  async editTask(task){
    this.setState({editTask: task, form: {
      name: task.name,
      repeat: task.repeat
    }});
  }
  
  async saveEditTask(){
    const { form, taskTemplates, tasks } = this.state;
    // Update the taskTemplate
    const taskTemplate = taskTemplates.find(taskTemplate => taskTemplate.id === this.state.editTask.id);
    const indexTemplate = taskTemplates.findIndex( taskTemplate => taskTemplate.id === this.state.editTask.id);
    taskTemplate.lastCreated = Date.now();
    taskTemplate.name = form.name;
    taskTemplate.repeat = form.repeat;
    taskTemplates[indexTemplate] = taskTemplate;
    this.setTaskTemplates(taskTemplates);
    // Update the task
    const task = tasks.find(task => task.id === this.state.editTask.id);
    const indexTask = tasks.findIndex( task => task.id === this.state.editTask.id);
    task.name = form.name;
    task.repeat = form.repeat;
    tasks[indexTask] = task;
    console.log(tasks);
    this.setTasks(tasks);

    // Close Modal
    this.setState({form: {name:"", repeat: ""}, editTask: null});
  }
  
  cancelEditTask(){
    this.setState({form: {name: "", repeat: ""}, editTask: null});
  }
  
  cancelNewTask(){
    this.setState({form: {name: "", repeat: ""}, showModal: false});
  }
  
  deleteEditTask(){
    const { form, taskTemplates, tasks } = this.state;
    // Update the taskTemplate
    const taskTemplate = taskTemplates.find(taskTemplate => taskTemplate.id === this.state.editTask.id);
    const indexTemplate = taskTemplates.findIndex( taskTemplate => taskTemplate.id === this.state.editTask.id);
    taskTemplates.splice(indexTemplate,1);
    this.setTaskTemplates(taskTemplates);
    // Update the task
    const task = tasks.find(task => task.id === this.state.editTask.id);
    const indexTask = tasks.findIndex( task => task.id === this.state.editTask.id);
    tasks.splice(indexTask,1);
    this.setTasks(tasks);

    // Close Modal
    this.setState({form: {name:"", repeat: ""}, editTask: null});
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Today's Tasks</Text>
        {this.state.tasks.length > 0 && (<FlatList
          data={this.state.tasks}
          renderItem={({item}) => (
            <ListTask task={item} onEdit={this.editTask.bind(this,item)} onComplete={this.completeTask.bind(this,item.id)} />
          )}
          keyExtractor={item => String(item.id)}
        />)}
        <Button style={styles.button} round onPress={() => {
          this.setState({showModal: true});
        }}>
          +
        </Button>
        <ModalTask
          show={this.state.showModal}
          form={this.state.form}
          setName={(event) => {this.setState({...this.state, form:{...this.state.form, name: event}})}}
          setRepeat={(event) => {this.setState({...this.state, form:{...this.state.form, repeat: event}})}}
          cancel={this.cancelNewTask.bind(this)}
          save={this.saveNewTask.bind(this)}
        />
        <ModalEditTask
          show={this.state.editTask !== null}
          form={this.state.form}
          setName={(event) => {this.setState({...this.state, form:{...this.state.form, name: event}})}}
          setRepeat={(event) => {this.setState({...this.state, form:{...this.state.form, repeat: event}})}}
          cancel={this.cancelEditTask.bind(this)}
          save={this.saveEditTask.bind(this)}
          delete={this.deleteEditTask.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    marginLeft: 30,
    marginRight: 30
  },
  header: {
    fontSize: 32,
    paddingBottom: 20,
  },
  button: {
    position: "absolute",
    bottom: 50,
    right: 10
  },
  buttonGroup: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  centerButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});
