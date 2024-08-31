import React, { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const AnimatedListItem = ({ children }) => {
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Animated.parallel([
    //   Animated.timing(fadeInAnim, {
    //     toValue: 1,
    //     duration: 500,
    //     useNativeDriver: true,
    //   }),
    //   Animated.spring(scaleAnim, {
    //     toValue: 1,
    //     friction: 10,
    //     tension: 40,
    //     useNativeDriver: true,
    //   }),
    // ]).start();

    return () => {
      // Cleanup das animações quando o componente for desmontado
      fadeInAnim.setValue(0);
      scaleAnim.setValue(0.3);
    };
  }, [fadeInAnim, scaleAnim]);

    //EU TIREI O USEFOCUS!! QUE(É O QUE AS LINHAS DE BAIXO FALAM)
    // Especifica o que fazer quando o componente recebe foco
    // Por exemplo, pode ser usado para chamar uma API ou outra lógica específica
    // Aqui, iniciamos as animações quando o componente recebe foco
    fadeInAnim.setValue(0); // Garante que a animação reinicie quando o componente é focado novamente
    scaleAnim.setValue(0.3);

    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    
  

 

  return (
    
      <Animated.View
        style={{
          opacity: fadeInAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        {children}
      </Animated.View>
    
  );
};

export default AnimatedListItem;
