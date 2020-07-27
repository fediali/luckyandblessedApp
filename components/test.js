<View style={{ flex: 1 }}>
    <View>
        <TouchableOpacity onPress={() => { this.setState({ isVisible: true }) }}
            style={{ flex: 1 }}>
            <Image resizeMode="cover"
                source={{ uri: this.state.image }}>
            </Image>
        </TouchableOpacity>
    </View>
    <Overlay isVisible={this.state.isVisible}>
        <View style={styles.fullscreenImage}>
            <Image resizeMode="contain"
                source={{ uri: this.state.imageUrl }} style={{ flex: 1 }}>
            </Image>
            <TouchableHighlight
                style={styles.overlayCancel}
                onPress={() => { this.setState({ isVisible: false }) }}>
                <Icon name="close"
                    style={styles.cancelIcon} size={28} />
            </TouchableHighlight>
        </View>
    </Overlay>
</View>