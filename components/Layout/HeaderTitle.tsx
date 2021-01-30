import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '../UI';

interface HeaderTitleProps {
  title: string;
}

export const HeaderTitle = React.memo<HeaderTitleProps>((props) => (
  <Text style={styles.titleText}>
    {props.title}
  </Text>
));

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.9
  }
});