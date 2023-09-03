import { formatUserAvatar, formatServerIcon } from "./Format";
import { totalGuildCount } from "./Guild";

interface Utils {
  totalGuildCount: typeof totalGuildCount;
  formatUserAvatar: typeof formatUserAvatar;
  formatServerIcon: typeof formatServerIcon;
}

const Utils: Utils = {
  totalGuildCount: totalGuildCount,
  formatUserAvatar: formatUserAvatar,
  formatServerIcon: formatServerIcon,
};

export { Utils };
