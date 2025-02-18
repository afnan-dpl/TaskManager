import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Modal, TextInput, Alert, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { database } from './FirebaseConfig';
import { ref, set, onValue, remove, update } from 'firebase/database';
import styles from './style'; // Import styles

const TaskManager = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tasksRef = ref(database, 'tasks/');
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const taskList = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })) : [];
      setTasks(taskList);
    });
  }, []);

  const handleAddTask = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setTaskName('');
    setTaskDetail('');
  };

  const handleOk = () => {
    if (!taskName.trim() || !taskDetail.trim()) {
      Alert.alert('Validation Error', 'Task Name and Task Detail cannot be empty.');
      return;
    }

    setIsSubmitting(true); // Disable the button
    const taskRef = ref(database, 'tasks/' + Date.now());
    set(taskRef, {
      name: taskName,
      detail: taskDetail,
      completed: false,
    })
    .then(() => {
      Alert.alert('Success', 'Task added successfully!');
      setModalVisible(false);
      setTaskName('');
      setTaskDetail('');
    })
    .catch((error) => {
      Alert.alert('Error', 'Failed to add task: ' + error.message);
    })
    .finally(() => {
      setIsSubmitting(false); // Re-enable the button
    });
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Delete Confirmation',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => {
            const taskRef = ref(database, 'tasks/' + taskId);
            remove(taskRef)
              .then(() => {
                Alert.alert('Success', 'Task deleted successfully!');
              })
              .catch((error) => {
                Alert.alert('Error', 'Failed to delete task: ' + error.message);
              });
          }
        },
      ],
      { cancelable: true }
    );
  };

  const handleCompleteTask = (taskId) => {
    const taskRef = ref(database, 'tasks/' + taskId);
    update(taskRef, { completed: true })
      .then(() => {
        Alert.alert('Success', 'Task marked as complete!');
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to update task: ' + error.message);
      });
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskTextContainer}>
        <Text style={styles.taskName}>{item.name}</Text>
        <Text style={styles.taskDetail}>{item.detail}</Text>
      </View>
      <View style={styles.taskActions}>
        {!item.completed && (
          <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>
            <Icon name="check" size={20} color="#090" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
          <Icon name="trash" size={20} color="#900" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completeTasks = tasks.filter(task => task.completed);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Task Manager</Text>
      </View>

      <Text style={styles.sectionHeader}>Incomplete Tasks</Text>
      {incompleteTasks.length === 0 ? (
        <Text style={styles.noTaskText}>No Task</Text>
      ) : (
        <FlatList
          data={incompleteTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          style={styles.taskList}
        />
      )}

      <Text style={styles.sectionHeader}>Complete Tasks</Text>
      {completeTasks.length === 0 ? (
        <Text style={styles.noTaskText}>No Completed Task</Text>
      ) : (
        <FlatList
          data={completeTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          style={styles.taskList}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Task Name"
              value={taskName}
              onChangeText={setTaskName}
              autoFocus={true}
            />
            <TextInput
              style={styles.textArea}
              placeholder="Task Detail"
              value={taskDetail}
              onChangeText={setTaskDetail}
              multiline={true}
              numberOfLines={4}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="OK" onPress={handleOk} color="#4CAF50" disabled={isSubmitting} />
              <Button title="Cancel" onPress={handleCancel} color="#F44336" />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TaskManager;
