import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { HeaderTitle } from './HeaderTitle';

export interface ScreenHeaderProps {
  title: string;
  rightContent?: () => React.ReactNode;
  leftContent?: () => React.ReactNode;
}

export const ScreenHeader = React.memo<ScreenHeaderProps>((props) => {
  const { title, rightContent, leftContent } = props;
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle title={title} />,
      headerRight: rightContent,
      headerLeft: leftContent
    });
  }, [navigation, rightContent, leftContent]);

  return null;
});