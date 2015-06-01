class MainNode extends Node { constructor(positions, path, id) {
    super(positions, path, id);

    this.id = 'about';
    this.size = 6;
  }

  color() {
    return App.colors.yellow;
  }

  draw() {
    super.draw();
    this.drawActiveCircle(2);
    let text = new createjs.Text('apie', "10px Open Sans", App.colors.black);
    text.set({
      textAlign: 'center'
    });
    text.y = -8;
    this.container.addChild(text);
  }

  activeColor() {
    return this.color();
  }

  activity() {
    return true;
  }

  title() {
    return 'apie';
  }

  count() {
    return '';
  }

  open() {
    this.openPage();
  }
}
