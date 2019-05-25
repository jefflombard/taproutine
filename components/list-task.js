import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Button from './button.js';

export default props => (
  <View style={styles.taskContainer}>
    <TouchableOpacity
      onPress={props.onEdit}
      style={styles.taskTitleButton}
    ><Text numberOfLines={1} style={styles.taskTitle}>{props.task.name}</Text></TouchableOpacity>
    <Button onPress={props.onComplete}>Complete</Button>
  </View>
)

const styles = StyleSheet.create({
  taskTitleButton: {
    maxWidth: "60%",
  },
  taskTitle: {
    fontSize: 16,
  },
  taskContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44,
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  }
});
