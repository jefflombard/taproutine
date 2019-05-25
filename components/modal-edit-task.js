import React from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from './button.js';

export default props => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.show}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Edit Task</Text>
        <Text>Task Name</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 6, marginBottom: 20, marginTop: 20}}
          value={props.form.name}
          onChangeText={props.setName}
          placeholder="Task Name"
        />
        <Text>Repeat every x days:</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1,  paddingLeft: 6, marginBottom: 20}}
          keyboardType='number-pad'
          value={props.form.repeat}
          onChangeText={props.setRepeat}
          placeholder="Repeat every X days"
        />
        <View style={styles.buttonGroup}>
          <Button base danger onPress={props.cancel}>Cancel</Button>
          <Button danger onPress={props.delete}>Delete</Button>
          <Button onPress={props.save}>Save</Button>
        </View>
      </View>
    </Modal>
  )
};



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
    bottom: 30,
    right: 0
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
