import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ComplainDash: React.FC = () => {
  return (
      <View style={styles.container}>
          <Text style={styles.title}>Complain dash Page</Text>
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginTop: 30,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    }
});

export default ComplainDash;