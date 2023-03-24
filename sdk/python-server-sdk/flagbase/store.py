class Store:
    def __init__(self):
        self.flags = {}

    def add_flag(self, flag_data: dict):
        flag_key = flag_data["flagKey"]
        self.flags[flag_key] = flag_data

    def get_flag(self, flag_key: str):
        return self.flags.get(flag_key)

    def get_flags(self,):
        return self.flags

    def remove_flag(self, flag_key: str):
        if flag_key in self.flags:
            del self.flags[flag_key]

    def clear_flags(self: str):
        self.flags.clear()

    def exists(self, flag_key: str):
        return flag_key in self.flags

