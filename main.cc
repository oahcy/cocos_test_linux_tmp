#include <iostream>
#include "../engine-native/templates/common/Classes/Game.h"

int xmain() {
  std::cout << "123456" << std::endl;
  auto _game = std::make_shared<Game>();
  _game->init();
  return 0;
}
