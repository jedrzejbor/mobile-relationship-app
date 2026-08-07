import { useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Player = 'X' | 'O';
type Cell = Player | null;

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

function getWinner(board: Cell[]) {
  for (const [first, second, third] of WINNING_LINES) {
    const value = board[first];
    if (value && value === board[second] && value === board[third]) {
      return value;
    }
  }

  return null;
}

export default function GameScreen() {
  const theme = useTheme();
  const [board, setBoard] = useState<Cell[]>(Array<Cell>(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [isResultVisible, setIsResultVisible] = useState(false);

  const winner = useMemo(() => getWinner(board), [board]);
  const isDraw = !winner && board.every(Boolean);
  const isFinished = Boolean(winner) || isDraw;
  const resultMessage = winner ? `Wygral gracz ${winner}` : 'Remis';

  const status = winner
    ? `Wygrywa ${winner}`
    : isDraw
      ? 'Remis'
      : `Ruch gracza ${currentPlayer}`;

  function handleCellPress(index: number) {
    if (board[index] || isFinished) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    const nextWinner = getWinner(nextBoard);
    const nextIsDraw = !nextWinner && nextBoard.every(Boolean);

    setBoard(nextBoard);

    if (nextWinner || nextIsDraw) {
      setIsResultVisible(true);
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  }

  function resetGame() {
    setBoard(Array<Cell>(9).fill(null));
    setCurrentPlayer('X');
    setIsResultVisible(false);
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.content}>
          <ThemedView style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>
              Kolko i krzyzyk
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.status}>
              {status}
            </ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.board}>
            {board.map((cell, index) => (
              <Pressable
                accessibilityLabel={`Pole ${index + 1}`}
                accessibilityRole="button"
                disabled={Boolean(cell) || isFinished}
                key={index}
                onPress={() => handleCellPress(index)}
                style={({ pressed }) => [
                  styles.cell,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.backgroundSelected,
                  },
                  pressed && styles.cellPressed,
                ]}>
                <ThemedText
                  style={[
                    styles.cellText,
                    cell === 'X' && styles.xText,
                    cell === 'O' && styles.oText,
                  ]}>
                  {cell}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          <Pressable
            accessibilityRole="button"
            onPress={resetGame}
            style={({ pressed }) => [
              styles.resetButton,
              { backgroundColor: theme.backgroundSelected },
              pressed && styles.resetButtonPressed,
            ]}>
            <ThemedText type="smallBold">Nowa gra</ThemedText>
          </Pressable>
        </ThemedView>
      </SafeAreaView>

      {isFinished && isResultVisible && (
        <Pressable
          accessibilityLabel="Zamknij wynik gry"
          accessibilityRole="button"
          onPress={() => setIsResultVisible(false)}
          style={styles.resultOverlay}>
          <ThemedView type="backgroundElement" style={styles.resultPanel}>
            <ThemedText type="subtitle" style={styles.resultTitle}>
              {resultMessage}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.resultHint}>
              Kliknij aby zamknąć
            </ThemedText>
          </ThemedView>
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    justifyContent: 'center',
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  status: {
    minHeight: 24,
    textAlign: 'center',
  },
  board: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 360,
    aspectRatio: 1,
    borderRadius: Spacing.three,
    padding: Spacing.two,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  cell: {
    width: '31.7%',
    aspectRatio: 1,
    borderRadius: Spacing.two,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellPressed: {
    opacity: 0.72,
  },
  cellText: {
    fontSize: 54,
    lineHeight: 62,
    fontWeight: 700,
  },
  xText: {
    color: '#1f7aec',
  },
  oText: {
    color: '#d14f27',
  },
  resetButton: {
    alignSelf: 'center',
    minWidth: 144,
    minHeight: 44,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  resetButtonPressed: {
    opacity: 0.72,
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.54)',
    padding: Spacing.four,
  },
  resultPanel: {
    width: '100%',
    maxWidth: 340,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  resultTitle: {
    textAlign: 'center',
  },
  resultHint: {
    textAlign: 'center',
  },
});
