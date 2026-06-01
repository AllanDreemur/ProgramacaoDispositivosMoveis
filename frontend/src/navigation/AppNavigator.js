import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// --- IMPORTAÇÕES DAS TELAS ---
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AlunoRegistrationScreen from '../screens/AlunoRegistrationScreen';
import ProfessorRegistrationScreen from '../screens/ProfessorRegistrationScreen';
import DisciplinaRegistrationScreen from '../screens/DisciplinaRegistrationScreen';
import BoletimScreen from '../screens/BoletimScreen';

import ProfessorDashboardScreen from '../screens/ProfessorDashboardScreen';
import MinhasDisciplinasScreen from '../screens/MinhasDisciplinasScreen';
import LancarNotasScreen from '../screens/LancarNotasScreen';
import ConsultarBoletinsScreen from '../screens/ConsultarBoletinsScreen';

import AlunoDashboardScreen from '../screens/AlunoDashboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Telas Gerais / Admin */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Menu Principal' }} />
        <Stack.Screen name="CadastroAluno" component={AlunoRegistrationScreen} options={{ title: 'Cadastro de Alunos' }} />
        <Stack.Screen name="CadastroProfessor" component={ProfessorRegistrationScreen} options={{ title: 'Cadastro de Professores' }} />
        <Stack.Screen name="CadastroDisciplina" component={DisciplinaRegistrationScreen} options={{ title: 'Cadastro de Disciplinas' }} />
        <Stack.Screen name="Boletim" component={BoletimScreen} options={{ title: 'Visualização de Boletim' }} />
        
        {/* Telas do Professor */}
        <Stack.Screen name="ProfessorDashboard" component={ProfessorDashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MinhasDisciplinas" component={MinhasDisciplinasScreen} options={{ title: 'Minhas Disciplinas' }} />
        {/* 2. Registrando a Rota de Lançamento de Notas */}
        <Stack.Screen name="LancarNotas" component={LancarNotasScreen} options={{ title: 'Lançar Notas' }} />
        <Stack.Screen name="ConsultarBoletins" component={ConsultarBoletinsScreen} options={{ title: 'Consultar Boletins' }} />
        <Stack.Screen name="AlunoDashboard" component={AlunoDashboardScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}