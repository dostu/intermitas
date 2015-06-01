class MainNode extends Node { constructor(positions, path, id) {
    super(positions, path, id);
    this.size = 6;
    this.title = 'apie';
  }

  color() {
    return App.colors.yellow;
  }

  update() {
    $('.main-node').css({ left: this.globalCoords().x, top: this.globalCoords().y });
  }

  draw() {
    super.draw();
    this.drawActiveCircle(2);
  }

  activeColor() {
    return this.color();
  }

  activity() {
    return true;
  }

  count() {
    return '';
  }

  open() {
    this.openPage();
  }
}
