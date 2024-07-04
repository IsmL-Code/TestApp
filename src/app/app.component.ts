import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { generate } from 'ng-zorro-antd/core/color';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  indeterminate = true;
  modalRequest = false;
  form1!: FormGroup;
  itemSelect: any;
  form2!: FormGroup;
  form3!: FormGroup;

  listRequest: any = [];
  listAdd: any;

  checkOptionsOne = [
    { label: 'PRINCIPAL', value: 'PRINCIPAL', checked: false, descrip:' Calle 12 de Diciembre. 28' },
    { label: 'SECUNDARIA', value: 'SECUNDARIA', checked: false,  descrip:' Calle Av. Quito' },
  ];

  typeMedicament = [
    'ANALGESICO',
    'ANELEPTICO',
    'ANESTESICO',
    'ANTIACIDO',
    'ANTIDEPRESIVO',
    'ANTIBIOTICO',
  ];

  constructor(
    private fb: FormBuilder,
    private ntService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.buildForms();
  }

  saveRequest() {
    if (this.form1.invalid) {
      this.ntService.error(
        'EL FORMULARIO DE MEDICAMENTO SE ENCUENTRA CON VALORES VACIOS, VERIFICAR POR FAVOR',
        ''
      );
    }
    if (this.form2.invalid) {
      this.ntService.error(
        'EL FORMULARIO DE DISTRIBUIDOR SE ENCUENTRA CON VALORES VACIOS, VERIFICAR POR FAVOR',
        ''
      );
    }

    if (!this.viewChange()) {
      this.ntService.error(
        'EL FORMULARIO DE SUCURSAL SE ENCUENTRA CON VALORES VACIOS, VERIFICAR POR FAVOR',
        ''
      );
    }

    if (this.form1.valid && this.form2.valid && this.viewChange()) {
      console.log(this.form1.value);
      console.log(this.form2.value);
      this.listAdd = this.checkOptionsOne.filter((x) => x.checked == true);
      console.log(this.listAdd);

      this.itemSelect = {
        medicament: this.form1.value,
        dealer: this.form2.value,
        direction: this.listAdd,
        send: false,
      };

      this.modalRequest = true;

      //this.listRequest.push(request);
      //this.deleteAll();
      //this.ntService.success('PEDIDO GENERADO EXITOSAMENTE', '');
    }
  }

  setDirections(item: any) {
    let cadena = '';

    item?.forEach((value: any) => {
      if (value?.value == 'PRINCIPAL') cadena += '  Calle 12 de Diciembre. 28';
      if (value?.value == 'SECUNDARIA') cadena += ' Calle Av. Quito';
    });
    return cadena;
  }

  buildForms() {
    this.form1 = this.fb.group({
      name_medicament: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/)]],
      type_medicament: [null, [Validators.required]],
      cant_medicament: [null, [Validators.required, this.noEsNegativo]],
    });

    this.form2 = this.fb.group({
      dealer: [null, [Validators.required]],
    });
  }

  noEsNegativo(control: { value: any; }) {
    const value = control.value;
    if (value < 0) {
      return { negativo: true };
    }
    if (value <= 0) {
      return { cantidadInvalida: true };
    }
    return null;
  }

  sendRequest() {
    this.modalRequest = false;
    this.listRequest.push(this.itemSelect);
    this.deleteAll();
  }

  cancelRequest() {
    this.modalRequest = false;
    this.deleteAll();
  }

  deleteAll() {
    this.form1.reset();
    this.form2.reset();
    this.checkOptionsOne.forEach((x) => (x.checked = false));
    this.listAdd = [];
    this.itemSelect = null;
  }

  viewChange() {
    let objt = this.checkOptionsOne.find((x) => x.checked == true);
    if (objt) return true;
    return false;
  }

  getDirections(item: any) {
    let cadena: any = '';
    item?.forEach((value: any) => {
      cadena += value.descrip + ' - ';
    });
    return cadena;
  }
  solicited(item: any) {
    this.modalRequest = true;
    this.itemSelect = item;
    console.log(item);
    item!.send = true;
  }



}
