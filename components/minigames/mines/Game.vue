<template>
    <div class="absolute top-14 left-0 w-screen bg-[#0F212E] text-white p-4 sm:p-6">
        <MinigamesRedirectButton :color="'white'" class="mt-2 ml-[-1rem]" />
        <div class="max-w-6xl mx-auto flex flex-col-reverse md:grid md:grid-cols-[320px,1fr] gap-3">
            <!-- Controls Panel -->
            <div class="flex flex-col-reverse md:flex-col space-y-2 md:space-y-4 mb-6 lg:mb-0">
                <div class="space-y-2">
                    <!-- Balance Display -->
                    <div v-if="!syncLoading" class="text-lg font-bold text-center bg-[#1A2C38] p-4 rounded-lg">
                        Balance: ${{ balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                    </div>
                    <div v-else
                        class="flex items-center justify-center gap-2 text-lg font-bold text-center bg-[#1A2C38] p-4 rounded-lg">
                        Balance: <Skeleton class="w-20 h-6"></Skeleton>
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
                            <label class="block text-sm text-gray-400 mb-2">Total Profit ({{ `${multiplier}x`
                                }})</label>
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
                                    class="flex-1 bg-[#243B4C] p-2 rounded-md text-white"
                                    :disabled="gameStarted || autoRunning">
                                <button class="px-3 py-1 bg-[#243B4C] rounded-md" @click="betAmount /= 2"
                                    :disabled="autoRunning">
                                    ½
                                </button>
                                <button class="px-3 py-1 bg-[#243B4C] rounded-md"
                                    @click="betAmount * 2 > balance ? betAmount = balance : betAmount *= 2"
                                    :disabled="autoRunning">
                                    2×
                                </button>
                            </div>
                        </div>

                        <div class="bg-[#1A2C38] p-4 rounded-lg">
                            <label class="block text-sm text-gray-400 mb-2">Mines</label>
                            <select v-model="numberOfMines" class="w-full bg-[#243B4C] p-2 rounded-md"
                                :disabled="gameStarted || autoRunning">
                                <option v-for="n in 24" :key="n" :value="n">{{ n }}</option>
                            </select>
                        </div>
                        <div class="bg-[#1A2C38] p-4 rounded-lg">
                            <label class="block text-sm text-gray-400 mb-2">Number of Games</label>
                            <input v-model="autoGames" type="number" class="w-full bg-[#243B4C] p-2 rounded-md"
                                :disabled="autoRunning">
                        </div>

                        <div class="bg-[#1A2C38] p-4 rounded-lg space-y-2">
                            <label class="block text-sm text-gray-400 mb-2">Reset on Win</label>
                            <button :class="[
                                'flex-1 py-2 px-4 rounded-md transition-colors duration-200',
                                resetOnWin ? 'bg-[#243B4C] text-white' : 'text-gray-400'
                            ]" @click="resetOnWin = false" :disabled="autoRunning">
                                Reset
                            </button>
                            <button :class="[
                                'flex-1 py-2 px-4 rounded-md transition-colors duration-200',
                                !resetOnWin ? 'bg-[#243B4C] text-white' : 'text-gray-400'
                            ]" @click="resetOnWin = true" :disabled="autoRunning">
                                Increase By
                            </button>
                            <div class="flex items-center">
                                <input v-model="increaseOnWinPercentage" type="number"
                                    class="w-full bg-[#243B4C] disabled:bg-[#203342] disabled:text-gray-400 p-2 rounded-md"
                                    :disabled="!resetOnWin || autoRunning">
                                <span>%</span>
                            </div>
                        </div>
                        <div class="bg-[#1A2C38] p-4 rounded-lg space-y-2">
                            <label class="block text-sm text-gray-400 mb-2">Reset on Loss</label>
                            <button :class="[
                                'flex-1 py-2 px-4 rounded-md transition-colors duration-200',
                                resetOnLoss ? 'bg-[#243B4C] text-white' : 'text-gray-400'
                            ]" @click="resetOnLoss = false" :disabled="autoRunning">
                                Reset
                            </button>
                            <button :class="[
                                'flex-1 py-2 px-4 rounded-md transition-colors duration-200',
                                !resetOnLoss ? 'bg-[#243B4C] text-white' : 'text-gray-400'
                            ]" @click="resetOnLoss = true" :disabled="autoRunning">
                                Increase By
                            </button>
                            <div class="flex items-center">
                                <input v-model="increaseOnLossPercentage" type="number"
                                    class="w-full bg-[#243B4C] disabled:bg-[#203342] disabled:text-gray-400 p-2 rounded-md"
                                    :disabled="!resetOnLoss || autoRunning">
                                <span>%</span>
                            </div>
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
                </div>
            </div>

            <!-- Game Grid -->
            <div class="h-fit grid grid-cols-5 gap-2 relative">
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
import betSound from '@/assets/bet.mp3';
import bombSound from '@/assets/bomb.mp3';
import gemSound from '@/assets/gem.mp3';
import cashoutSound from '@/assets/cashout.mp3';
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const syncLoading = ref(true)
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
const increaseOnWinPercentage = ref(0)

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

const lastUpdated = ref(null)

// Helper to get the current timestamp
const getCurrentTimestamp = () => new Date().toISOString()

// Sync balance with Supabase and localStorage
const syncBalanceWithSupabase = async () => {
    if (!user.value) return

    syncLoading.value = true
    let now = getCurrentTimestamp()

    let supabaseLastUpdated = null
    let supabaseBalance = null

    const { data: balanceData, error: fetchError } = await supabase
        .from('balances')
        .select('balance, last_updated, gameState')
        .eq('user_id', user.value.id)
        .order('last_updated', { ascending: false })

    if (balanceData.length > 0) {
        supabaseLastUpdated = balanceData[0].last_updated
        supabaseBalance = balanceData[0].balance
    }

    if (supabaseLastUpdated) {
        balance.value = Number(supabaseBalance)
        lastUpdated.value = supabaseLastUpdated
    }
    if (balanceData[0].gameState) {
        const gameState = balanceData[0].gameState
        betAmount.value = gameState.betAmount
        numberOfMines.value = gameState.numberOfMines
        gameStarted.value = gameState.gameStarted
        gameOver.value = gameState.gameOver
        cells.value = gameState.cells
        chosenCells.value = gameState.chosenCells
        revealedCount.value = gameState.revealedCount
        winnings.value = gameState.winnings
    }

    syncLoading.value = false
}

// Update Supabase when unmounted
const updateSupabaseBalance = async () => {
    if (!user.value) return;

    const gameState = {
        betAmount: betAmount.value,
        numberOfMines: numberOfMines.value,
        gameStarted: gameStarted.value,
        gameOver: gameOver.value,
        cells: cells.value,
        chosenCells: chosenCells.value,
        revealedCount: revealedCount.value,
        winnings: winnings.value,
    }

    try {
        // Use the Nuxt server API to update the balance
        const response = await $fetch('/api/updateBalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.value.id,
                balance: balance.value,
                gameState: gameStarted.value ? gameState : null,
            }),
            keepalive: true, // Ensure the request completes even if the page is closing
        });
    } catch (err) {
        console.error('Error updating balance through Nuxt server API:', err);
    }
};


const handleBeforeUnload = async () => {
    await updateSupabaseBalance()
}

let saveInterval;

onMounted(async () => {
    await syncBalanceWithSupabase();

    saveInterval = setInterval(async () => {
        await updateSupabaseBalance();
    }, 60000);

    window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(async () => {
    clearInterval(saveInterval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
});

const calculateWinnings = () => {
    if (revealedCount.value === 0) return 0
    winnings.value = betAmount.value * multiplier.value
}

const startGame = () => {
    if (betAmount.value > balance.value) return

    var audio = new Audio(betSound)
    audio.play()

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

    var audio = new Audio(cashoutSound)
    audio.play()

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
        var audio = new Audio(bombSound);
        audio.play();
    } else {
        // Increment revealed count
        revealedCount.value++;
        calculateWinnings();
        var audio = new Audio(gemSound)

        if (!isAutoMode.value) audio.play()

        // Win condition: all safe cells revealed
        if (revealedCount.value === 25 - numberOfMines.value) {
            cashOut();
        }
    }
};

const startAutoGame = async () => {
    autoRunning.value = true;
    const originalBetAmount = betAmount.value;
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
            betAmount.value += betAmount.value * (increaseOnLossPercentage.value / 100);
        }

        if (selectedCells.value.find((index) => cells.value[index].isMine) && !resetOnLoss.value) {
            betAmount.value = originalBetAmount;
        }

        if (!selectedCells.value.find((index) => cells.value[index].isMine) && resetOnWin.value) {
            betAmount.value += betAmount.value * (increaseOnWinPercentage.value / 100);
        }

        if (!selectedCells.value.find((index) => cells.value[index].isMine) && !resetOnWin.value) {
            betAmount.value = originalBetAmount;
        }

        cashOut();
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
