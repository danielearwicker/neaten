function getOrAdd<K, V>(map: Map<K, V>, key: K, value: () => V) {

    let v = map.get(key);
    if (v !== undefined) {
        return v;
    }

    v = value();
    map.set(key, v);
    return v;
}
