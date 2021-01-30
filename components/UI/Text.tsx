import * as React from 'react';
import { Text as DefaultText, TextStyle } from 'react-native';

const fontWeight: { [key in string]: string; } = {
  '400': 'IBMPlexSans-Regular',
  '500': 'IBMPlexSans-Medium'
};

export const Text = React.memo<DefaultText['props']>((props) => {
  const style = props.style as (TextStyle | undefined);
  const fontFamily = fontWeight[style?.fontWeight || '400'];

  return (
    <DefaultText {...props} style={[props.style, { fontFamily }]}>
      {props.children}
    </DefaultText>
  );
});
