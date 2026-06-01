import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ProfessorRegistrationScreen from '../screens/ProfessorRegistrationScreen';
import DisciplinaRegistrationScreen from '../screens/DisciplinaRegistrationScreen';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AlunoRegistrationScreen from '../screens/AlunoRegistrationScreen';
import BoletimScreen from '../screens/BoletimScreen';

import ProfessorDashboardScreen from '../screens/ProfessorDashboardScreen';
import MinhasDisciplinasScreen from '../screens/MinhasDisciplinasScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Menu Principal' }} />
        <Stack.Screen name="CadastroAluno" component={AlunoRegistrationScreen} options={{ title: 'Cadastro de Alunos' }} />
        <Stack.Screen name="CadastroProfessor" component={ProfessorRegistrationScreen} options={{ title: 'Cadastro de Professores' }} />
        <Stack.Screen name="CadastroDisciplina" component={DisciplinaRegistrationScreen} options={{ title: 'Cadastro de Disciplinas' }} />
        <Stack.Screen name="Boletim" component={BoletimScreen} options={{ title: 'Visualização de Boletim' }} />
        
        <Stack.Screen name="ProfessorDashboard" component={ProfessorDashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MinhasDisciplinas" component={MinhasDisciplinasScreen} options={{ title: 'Minhas Disciplinas' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}