import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default props => (
  <TouchableOpacity onPress={props.onPress} style={generateButtonStyle(props)}>
    <Text style={generateButtonTextStyle(props)}>{props.children}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    color: "#fff"
  },
  buttonContainer: {
    height: 38,
    width: 100,
    display: "flex",
    padding: 6,
    backgroundColor: "#9C27B0",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center"
  }
});

function generateButtonTextStyle(props){
  const styleList = [styles.buttonText];
  
  if (props.round) styleList.push({ fontSize: 18 })
  if (props.base) styleList.push({color: "#9C27B0"})
  if (props.base && props.danger) styleList.push({color: "red"})
  
  return styleList;
}


function generateButtonStyle(props){
  const styleList = [styles.buttonContainer];
  
  if (props.danger) styleList.push({ backgroundColor: "red"})
  if (props.round) styleList.push({ borderRadius: 50, width: 50, height: 50 })
  if (props.base) styleList.push({backgroundColor: "none"})
  if (props.style) styleList.push(props.style)
  
  return styleList;
}
