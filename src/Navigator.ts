export class Navigator {
    private currentIndex: number = 0;
    private itemCount: number = 0;
    private columns: number = 4; // Default, will update based on grid
    private onFocusChange: (index: number) => void;
    private onEnter: (index: number) => void;

    constructor(onFocusChange: (index: number) => void, onEnter: (index: number) => void) {
        this.onFocusChange = onFocusChange;
        this.onEnter = onEnter;
        this.initListeners();
    }

    setItems(count: number, columns: number) {
        this.itemCount = count;
        this.columns = columns;
        // Ensure index is valid
        if (this.currentIndex >= this.itemCount) {
            this.currentIndex = this.itemCount - 1;
        }
        if (this.currentIndex < 0) this.currentIndex = 0;
    }

    private initListeners() {
        window.addEventListener('keydown', (e) => this.handleKey(e));
    }

    private handleKey(e: KeyboardEvent) {
        // Prevent default scrolling for arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }

        let nextIndex = this.currentIndex;

        switch (e.key) {
            case 'ArrowRight':
                nextIndex++;
                break;
            case 'ArrowLeft':
                nextIndex--;
                break;
            case 'ArrowDown':
                nextIndex += this.columns;
                break;
            case 'ArrowUp':
                nextIndex -= this.columns;
                break;
            case 'Enter':
                this.onEnter(this.currentIndex);
                return;
        }

        // Boundary checks
        if (nextIndex >= 0 && nextIndex < this.itemCount) {
            this.currentIndex = nextIndex;
            this.onFocusChange(this.currentIndex);
        }
    }

    resetFocus() {
        this.currentIndex = 0;
        this.onFocusChange(0);
    }
}
