import React, { useState, useEffect, Fragment } from "react";
import { StyleSheet, Text, View, ActivityIndicator, TouchableHighlight } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Form from './Form';

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState(false);
  const [addPositionForm, setAddPositionForm] = useState(false);
  const [currentForm, setCurrentForm] = useState({ name: '', symbol: '', purchasePrice: '', shares: '' })
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch(
          "https://arcane-headland-69553.herokuapp.com/api"
        );
        if (response.status >= 400) throw "Error Fetching Data!";
        let { state } = await response.json();
        setPortfolio(state);
      } catch (error) {
        setError(true);
      }
    }
    fetchPortfolio();
  }, []);

  const addNewPosition = () => {
    setAddPositionForm(true);
  }

  const editPosition = index => () => {
    setCurrentForm(portfolio[index]);
    setAddPositionForm(true);
  }

  const deletePosition = index => async () => {
    try {
      const response = await fetch(
        "https://arcane-headland-69553.herokuapp.com/api",
        {
          method: 'delete',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbol: portfolio[index].symbol }),
        }
      );
      if (response.status >= 400) throw "Error Fetching Data!";
      const newPortfolio = [...portfolio];
      newPortfolio.splice(index, 1)
      setPortfolio(newPortfolio)
    } catch (error) {
      setError(true);
    }
  }

  return (
    <View style={styles.container}>
      {!addPositionForm ?
        <>
          <View style={styles.headerView}><Text style={styles.titleText}>Current Portfolio</Text></View>
          <View style={styles.positionView}>
            {!portfolio && !error && <ActivityIndicator size="large" color="#fff" />}
            {portfolio && portfolio.map(({ symbol, shares, purchasePrice }, index) =>
              <View style={styles.positionRow} key={symbol}>
                <TouchableHighlight onPress={deletePosition(index)}>
                  <Ionicons name="md-remove-circle-outline" size={32} color="red" style={styles.positionIcon} />
                </TouchableHighlight>
                <Text style={styles.position}>{`${symbol} . . . . . . . . ${shares} shares @ $${purchasePrice}`}</Text>
                <TouchableHighlight onPress={editPosition(index)}>
                  <Ionicons name="md-settings" size={32} color="white" style={styles.positionIcon} />
                </TouchableHighlight>
              </View>
            )}
            <View style={styles.headerView}>
              <View style={styles.positionRow}>
                <TouchableHighlight onPress={addNewPosition}>
                  <Ionicons name="md-add-circle-outline" size={32} color="white" style={styles.positionIcon} />
                </TouchableHighlight>
                <Text style={styles.addText}>Add </Text>
              </View>
            </View>
            {error && <Text style={styles.error}>Error . . .</Text>}
          </View>
        </> :
        <Form
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          formValues={currentForm}
          setCurrentForm={setCurrentForm}
          setAddPositionForm={setAddPositionForm}
        />}
    </View>
  );
}


export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7FFF00",
    color: "#FFF",
    alignItems: "stretch",
    justifyContent: "center"
  },
  positionView: {
    flex: 3,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  headerView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  titleText: {
    color: "#FFF",
    fontSize: 30
  },
  addText: {
    color: "#FFF",
    fontSize: 15
  },
  positionRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  position: {
    color: "#FFF",
    fontSize: 20
  },
  positionIcon: {
    paddingLeft: 20,
    paddingRight: 10
  }
});
