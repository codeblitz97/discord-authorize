import { totalGuildCount } from "./Guild";

interface Utils {
  totalGuildCount: typeof totalGuildCount;
}

const Utils: Utils = {
  totalGuildCount: totalGuildCount,
};

export { Utils };
