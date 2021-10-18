#include <iostream>
#include "../engine-native/templates/common/Classes/Game.h"

int main() {
  std::cout << "1234" << std::endl;
  auto _game = std::make_shared<Game>();
  _game->init();
  return 0;
}
