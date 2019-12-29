import React from 'react'
import {
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import { ApplicationProvider, Text, Avatar } from '@ui-kitten/components'
import { mapping, light as lightTheme } from '@eva-design/eva'

class HomeScreen extends React.Component {
  state = {
    loading: false,
    data: [],
    page: 1,
    seed: 1,
    error: null
  }

  componentDidMount() {
    this.makeRemoteRequest()
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`
    this.setState({ loading: true })

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false
        })
      })
      .catch(error => {
        this.setState({ error, loading: false })
      })
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%'
        }}
      />
    )
  }

  renderFooter = () => {
    if (!this.state.loading) return null

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE'
        }}>
        <ActivityIndicator animating size='large' />
      </View>
    )
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 20,
          marginTop: 40
        }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => alert('Item pressed!')}>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 16,
                  alignItems: 'center'
                }}>
                <Avatar
                  source={{ uri: item.picture.thumbnail }}
                  size='giant'
                  style={{ marginRight: 16 }}
                />
                <Text
                  category='s1'
                  style={{
                    color: '#000'
                  }}>{`${item.name.first} ${item.name.last}`}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={50}
        />
      </View>
    )
  }
}

const App = () => (
  <ApplicationProvider mapping={mapping} theme={lightTheme}>
    <HomeScreen />
  </ApplicationProvider>
)

export default App
