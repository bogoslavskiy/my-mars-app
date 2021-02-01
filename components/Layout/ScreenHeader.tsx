import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { HeaderTitle } from './HeaderTitle';
import { View } from 'react-native';

export interface ScreenHeaderProps {
  title: string;
  rightContent?: () => React.ReactNode;
  leftContent?: () => React.ReactNode;
}

export const ScreenHeader = React.memo<ScreenHeaderProps>((props) => {
  const { title, rightContent, leftContent } = props;
  const navigation = useNavigation();

  const headerRight = React.useMemo(() => {
    // Hack for react-navigation 
    // This set title by center 
    return () => (
      <View>{rightContent && rightContent()}</View>
    )
  }, [rightContent]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle title={title} />,
      headerRight: headerRight,
      headerLeft: leftContent
    });
  }, [navigation, rightContent, leftContent]);

  return null;
});