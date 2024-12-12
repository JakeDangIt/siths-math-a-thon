<template>
    <div class="absolute top-14 left-0 w-screen bg-[#0F212E] text-white p-4 sm:p-6">
        <div class="max-w-6xl mx-auto flex flex-col-reverse md:flex-col lg:grid lg:grid-cols-[320px,1fr] gap-3">
            <!-- Controls Panel -->
            <div class="space-y-2 md:space-y-4 mb-6 lg:mb-0">
                <!-- Balance Display -->
                <div class="text-lg font-bold text-center bg-[#1A2C38] p-4 rounded-lg">
                    Balance: ${{ balance.toFixed(2) }}
                </div>

                <!-- Mode Toggle -->
                <div class="bg-[#1A2C38] rounded-lg p-1 flex">
                    <button :class="[
                        'flex-1 py-2 px-4 rounded-md transition-colors duration-200',
                        !isAutoMode ? 'bg-[#243B4C] text-white' : 'text-gray-400'
                    ]" @click="isAutoMode = false; resetGame()">
                        Manual
                    </button>
                    <button :class="[
                        'flex-1 py-2 px-4 rounded-md transition-colors duration-200',
                        isAutoMode ? 'bg-[#243B4C] text-white' : 'text-gray-400'
                    ]" @click="isAutoMode = true; resetGame()">
                        Auto
                    </button>
                </div>

                <!-- Manual Controls -->
                <div v-if="!isAutoMode" class="space-y-2 md:space-y-4">
                    <div class="bg-[#1A2C38] p-4 rounded-lg">
                        <label class="block text-sm text-gray-400 mb-2">Bet Amount</label>
                        <div class="flex items-center gap-2">
                            <input v-model="betAmount" type="number"
                                class="flex-1 bg-[#243B4C] p-2 rounded-md text-white" :disabled="gameStarted">
                            <button class="px-3 py-1 bg-[#243B4C] rounded-md" @click="betAmount /= 2">
                                ½
                            </button>
                            <button class="px-3 py-1 bg-[#243B4C] rounded-md"
                                @click="betAmount * 2 > balance ? betAmount = balance : betAmount *= 2">
                                2×
                            </button>
                        </div>
                    </div>

                    <div class="bg-[#1A2C38] p-4 rounded-lg">
                        <label class="block text-sm text-gray-400 mb-2">Mines</label>
                        <select v-model="numberOfMines" class="w-full bg-[#243B4C] p-2 rounded-md"
                            :disabled="gameStarted">
                            <option v-for="n in 24" :key="n" :value="n">{{ n }}</option>
                        </select>
                    </div>

                    <div v-if="gameStarted && !gameOver" class="bg-[#1A2C38] p-4 rounded-lg">
                        <label class="block text-sm text-gray-400 mb-2">Total Profit ({{ `${multiplier}x` }})</label>
                        <input v-model="formattedWinnings" type="number"
                            class="flex-1 bg-[#243B4C] p-2 rounded-md text-white" disabled>
                    </div>
                </div>

                <!-- Auto Controls -->
                <div v-else class="space-y-4">
                    <div class="bg-[#1A2C38] p-4 rounded-lg">
                        <label class="block text-sm text-gray-400 mb-2">Bet Amount</label>
                        <div class="flex items-center gap-2">
                            <input v-model="betAmount" type="number"
                                class="flex-1 bg-[#243B4C] p-2 rounded-md text-white" :disabled="gameStarted">
                            <button class="px-3 py-1 bg-[#243B4C] rounded-md" @click="betAmount /= 2">
                                ½
                            </button>
                            <button class="px-3 py-1 bg-[#243B4C] rounded-md"
                                @click="betAmount * 2 > balance ? betAmount = balance : betAmount *= 2">
                                2×
                            </button>
                        </div>
                    </div>

                    <div class="bg-[#1A2C38] p-4 rounded-lg">
                        <label class="block text-sm text-gray-400 mb-2">Mines</label>
                        <select v-model="numberOfMines" class="w-full bg-[#243B4C] p-2 rounded-md"
                            :disabled="gameStarted">
                            <option v-for="n in 24" :key="n" :value="n">{{ n }}</option>
                        </select>
                    </div>
                    <div class="bg-[#1A2C38] p-4 rounded-lg">
                        <label class="block text-sm text-gray-400 mb-2">Number of Games</label>
                        <input v-model="autoGames" type="number" class="w-full bg-[#243B4C] p-2 rounded-md">
                    </div>

                    <div class="bg-[#1A2C38] p-4 rounded-lg space-y-2">
                        <label class="block text-sm text-gray-400 mb-2">Reset on Loss</label>
                        <button :class="[
                            'flex-1 py-2 px-4 rounded-md transition-colors duration-200',
                            resetOnLoss ? 'bg-[#243B4C] text-white' : 'text-gray-400'
                        ]" @click="resetOnLoss = false">
                            Reset
                        </button>
                        <button :class="[
                            'flex-1 py-2 px-4 rounded-md transition-colors duration-200',
                            !resetOnLoss ? 'bg-[#243B4C] text-white' : 'text-gray-400'
                        ]" @click="resetOnLoss = true">
                            Increase By
                        </button>
                        <div class="flex items-center">
                        <input v-model="increaseOnLossPercentage" type="number" class="w-full bg-[#243B4C] disabled:bg-[#203342] p-2 rounded-md"
                            :disabled="!resetOnLoss">
                            <span>%</span>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-2">
                    <button @click="isAutoMode ? startAutoGame() : startGame()"
                        :disabled="gameStarted || betAmount <= 0 || betAmount > balance || (isAutoMode && selectedCells.length === 0 || autoRunning)"
                        class="w-full bg-[#00E701] hover:bg-[#00C701] disabled:bg-gray-600 text-black font-bold py-3 rounded-lg transition-colors duration-200">
                        {{ isAutoMode ? 'Start Auto Bet' : 'Bet' }}
                    </button>
                    <button v-if="gameStarted && !gameOver && !isAutoMode" @click="cashOut"
                        :disabled="gameOver || revealedCount === 0"
                        class="w-full bg-[#00E701] hover:bg-[#00C701] disabled:bg-[#00c700ce] text-black font-bold py-3 rounded-lg transition-colors duration-200">
                        Cash Out
                    </button>
                    <button v-if="isAutoMode && autoRunning" @click="stopAutoGame"
                        class="w-full bg-[#00E701] hover:bg-[#00C701] disabled:bg-[#00c700ce] text-black font-bold py-3 rounded-lg transition-colors duration-200">
                        Stop Auto Bet
                    </button>
                    {{ selectedCells }}
                </div>
            </div>

            <!-- Game Grid -->
            <div class="grid grid-cols-5 gap-2 relative">
                <button v-for="(cell, index) in cells" :key="index"
                    @click="!isAutoMode ? revealCell(index) : selectCell(index)"
                    :disabled="(!gameStarted || cell.revealed || gameOver) && (!isAutoMode && !gameStarted || autoRunning)"
                    class="aspect-square rounded-lg transition-all duration-300 relative overflow-hidden"
                    :class="getCellClasses(cell, index), { 'bg-[#962EFF] hover:bg-[#962EFF]': isAutoMode && selectedCells.includes(index) }">
                    <transition name="reveal">
                        <div v-if="cell.revealed || (gameOver && !cell.revealed)"
                            class="absolute inset-0 flex items-center justify-center"
                            :class="{ 'scale-75 opacity-50': gameOver && !cell.revealed }">
                            <template v-if="cell.isMine">
                                <div class="mine-explosion">
                                    <svg viewBox="0 0 24 24" class="w-8 h-8 text-red-500">
                                        <circle cx="12" cy="12" r="10" class="fill-current" />
                                    </svg>
                                </div>
                            </template>
                            <template v-else>
                                <div :class="{ 'diamond-reveal': chosenCells.includes(index) }">
                                    <svg viewBox="0 0 24 24" class="w-8 h-8"
                                        :class="gameOver && !cell.revealed ? 'text-[#243B4C]' : 'text-[#00E701]'">
                                        <path d="M12 2L22 12L12 22L2 12L12 2Z" class="fill-current" />
                                    </svg>
                                </div>
                            </template>
                        </div>
                    </transition>
                </button>
                <Transition name="fade">
                    <div v-if="showWinPopup"
                        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                        style="pointer-events: none;">
                        <div class="bg-[#1A2C38] p-4 rounded-lg shadow-lg border border-[#00E701] animate-popup">
                            <div class="text-[#00E701] text-2xl font-bold text-center mb-1">
                                {{ multiplier }}x
                            </div>
                            <div
                                class="text-[#00E701] text-xl font-bold text-center flex items-center justify-center gap-1">
                                ${{ winnings.toFixed(2) }}
                                <span class="w-4 h-4 rounded-full bg-yellow-500"></span>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { mines } from '~/utils/mines.js'

// Game state
const balance = ref(1000)
const betAmount = ref(10)
const numberOfMines = ref(3)
const gameStarted = ref(false)
const gameOver = ref(false)
const cells = ref([])
const chosenCells = ref([])
const selectedCells = ref([])
const revealedCount = ref(0)
const winnings = ref(0)
const formattedWinnings = computed(() => winnings.value.toFixed(2))
const multiplier = computed(() => revealedCount.value != 0 ? mines.find((mine) => mine.mines === numberOfMines.value).multiplier[revealedCount.value - 1] : 1)

// Auto mode state
const isAutoMode = ref(false)
const autoGames = ref(10)
const autoRunning = ref(false)
const resetOnLoss = ref(false)
const increaseOnLossPercentage = ref(0)
const resetOnWin = ref(false)

const showWinPopup = ref(false)

// Initialize cells
const initializeCells = () => {
    cells.value = Array(25).fill(null).map(() => ({
        isMine: false,
        revealed: false
    }))

    let minesPlaced = 0
    while (minesPlaced < numberOfMines.value) {
        const randomIndex = Math.floor(Math.random() * 25)
        if (!cells.value[randomIndex].isMine) {
            cells.value[randomIndex].isMine = true
            minesPlaced++
        }
    }
}

const calculateWinnings = () => {
    if (revealedCount.value === 0) return 0
    winnings.value = betAmount.value * multiplier.value
}

const startGame = () => {
    if (betAmount.value > balance.value) return

    chosenCells.value = []
    showWinPopup.value = false
    gameStarted.value = true
    gameOver.value = false
    revealedCount.value = 0
    winnings.value = betAmount.value
    balance.value -= betAmount.value
    initializeCells()
}

const cashOut = () => {
    if (!gameStarted.value || gameOver.value) return
    chosenCells.value = []
    balance.value += winnings.value
    gameStarted.value = false
    gameOver.value = true
    showWinPopup.value = true
    setTimeout(() => {
        showWinPopup.value = false
    }, 2000)
}

const resetGame = () => {
    chosenCells.value = []
    showWinPopup.value = false
    gameStarted.value = false
    gameOver.value = false
    revealedCount.value = 0
    winnings.value = 0
    initializeCells()
}

// Completion of the `revealCell` function and auto mode functionality
const revealCell = (index) => {
    if (!gameStarted.value || cells.value[index].revealed) return;

    cells.value[index].revealed = true;
    chosenCells.value.push(index);

    if (cells.value[index].isMine) {
        // Game over on mine reveal
        gameOver.value = true;
        gameStarted.value = false;
        cells.value.forEach((cell) => {
            if (cell.isMine) cell.revealed = true;
        });
    } else {
        // Increment revealed count
        revealedCount.value++;
        calculateWinnings();

        // Win condition: all safe cells revealed
        if (revealedCount.value === 25 - numberOfMines.value) {
            cashOut();
        }
    }
};

const startAutoGame = async () => {
    autoRunning.value = true;
    let gamesPlayed = 0;

    while (autoRunning.value && gamesPlayed < autoGames.value) {
        if (balance.value < betAmount.value) {
            autoRunning.value = false;
            break;
        }
        startGame();

        for (let i = 0; i < 25; i++) {
            // make selected cells have mines at the end of the array
            selectedCells.value = selectedCells.value.sort((a, b) => cells.value[a].isMine - cells.value[b].isMine);
            selectedCells.value.forEach((index) => {
                revealCell(index);
            });
        }

        if (selectedCells.value.find((index) => cells.value[index].isMine) && resetOnLoss.value) {
            console.log(betAmount.value, betAmount.value * (increaseOnLossPercentage.value / 100))
            betAmount.value += betAmount.value * (increaseOnLossPercentage.value / 100);
            console.log(betAmount.value)
        }
        else {
            cashOut();
        }
        gamesPlayed++;

        // Delay before next game
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    autoRunning.value = false;
};

const stopAutoGame = () => {
    autoRunning.value = false;
    resetGame();
};

const selectCell = (index) => {
    if (selectedCells.value.includes(index)) {
        selectedCells.value = selectedCells.value.filter((cell) => cell !== index);
        return;
    }
    selectedCells.value.push(index);
};

const getCellClasses = (cell, index) => {
    if (!gameStarted.value) {
        return 'bg-[#1A2C38] hover:bg-[#243B4C]'
    }
    if (cell.revealed) {
        return cell.isMine ? 'bg-red-500' : 'bg-[#243B4C]'
    }
    return 'bg-[#1A2C38] hover:bg-[#243B4C] active:bg-[#2D4860]'
}

onMounted(() => {
    initializeCells()
})
</script>

<style scoped>
.reveal-enter-active,
.reveal-leave-active {
    transition: all 0.3s ease;
}

.reveal-enter-from,
.reveal-leave-to {
    opacity: 0;
    transform: scale(0.5);
}

.diamond-reveal {
    animation: diamond-glow 1s ease-out;
}

.mine-explosion {
    animation: explode 0.5s ease-out;
}

@keyframes diamond-glow {
    0% {
        opacity: 0;
        transform: scale(0.5);
        filter: brightness(2);
    }

    50% {
        opacity: 1;
        transform: scale(1.2);
        filter: brightness(1.5) drop-shadow(0 0 10px #00E701);
    }

    100% {
        transform: scale(1);
        filter: brightness(1);
    }
}

@keyframes explode {
    0% {
        opacity: 0;
        transform: scale(0.5);
    }

    50% {
        opacity: 1;
        transform: scale(1.5);
    }

    100% {
        transform: scale(1);
    }
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes popup {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.animate-popup {
    animation: popup 0.5s ease-out forwards;
}
</style>
