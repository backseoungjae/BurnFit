/**
 * @file DailyRecordTabs.tsx
 * @description 캘린더 하단에 위치하여 일별 기록(식단, 운동, 신체)을 보여주는 탭 컴포넌트입니다.
 *
 * @state {string} selectedTab - 현재 선택된 탭 (e.g., '식단')
 *
 * @description
 * 사용자가 날짜를 선택했을 때 해당 날짜의 기록을 탭 형태로 보여주고 관리하는 UI를 제공합니다.
 * 탭 선택 상태는 자체적으로 관리하며, 기록 추가를 위한 FAB(Floating Action Button)을 포함합니다.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TABS = ['식단', '운동', '신체'];

export default function DailyRecordTabs() {
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.selectedTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.selectedTabText,
              ]}
            >
              {tab} 0
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>
          추가 버튼을 눌러{'\n'}
          {selectedTab}을 기록해주세요
        </Text>
      </View>

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f3f8',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    color: '#8A8A8E',
  },
  selectedTabText: {
    fontWeight: '600',
    color: '#000',
  },
  placeholderContainer: {
    flex: 1,
    paddingTop: 30,
  },
  placeholderText: {
    fontSize: 17,
    color: '#c5c5c7',
    textAlign: 'center',
    lineHeight: 25,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 32,
  },
});
