import React from "react";
import { Button, StyleSheet, View, Text, TextInput } from 'react-native';

function Form({ formValues, setCurrentForm, portfolio, setAddPositionForm, setPortfolio }) {

  const postPosition = async () => {
    try {
      const body = { position: formValues }
      console.log('formValues', formValues)
      const method = portfolio.find(p => p.symbol === formValues.symbol) ? 'PUT' : 'POST'
      console.log('method', method)
      await fetch(
        'https://arcane-headland-69553.herokuapp.com/api', {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
      );
      console.log('sucessfully updated');
      const newPortfolio = [...[...portfolio].filter(p => p.symbol !== formValues.symbol), formValues];
      setPortfolio(newPortfolio);
      setAddPositionForm(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.tempView}>
        <Text style={styles.titleText}>Set position</Text>
        <>
          <Text style={styles.fieldText}>Name:</Text>
          <TextInput
            style={{ height: 40, width: 200, backgroundColor: "#FFF", margin: 5 }}
            onChangeText={(text) => setCurrentForm({ ...formValues, name: text })}
            value={`${formValues.name}`}
          />
          <Text style={styles.fieldText}>Symbol:</Text>
          <TextInput
            style={{ height: 40, width: 200, backgroundColor: "#FFF", margin: 5 }}
            onChangeText={(text) => setCurrentForm({ ...formValues, symbol: text })}
            value={`${formValues.symbol}`}
          />
          <Text style={styles.fieldText}>Price:</Text>
          <TextInput
            style={{ height: 40, width: 200, backgroundColor: "#FFF", margin: 5 }}
            onChangeText={(text) => setCurrentForm({ ...formValues, purchasePrice: text })}
            value={`${formValues.purchasePrice}`}
          />
          <Text style={styles.fieldText}>Shares:</Text>
          <TextInput
            style={{ height: 40, width: 200, backgroundColor: "#FFF", margin: 5 }}
            onChangeText={(text) => setCurrentForm({ ...formValues, shares: text })}
            value={`${formValues.shares}`}
          />
          <Button
            title="Submit"
            onPress={postPosition}
          />
        </>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7FFF00",
    color: "#FFF",
    justifyContent: "center"
  },
  titleText: {
    color: "#FFF",
    fontSize: 25
  },
  fieldText: {
    color: "#FFF",
    fontSize: 15
  },
  successText: {
    color: "green",
    fontSize: 15
  },
  tempView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
});


export default Form;
